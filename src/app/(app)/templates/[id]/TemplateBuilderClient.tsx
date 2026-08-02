"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileCode, FileArchive, Save, Folder, File, FolderTree, FolderOpen, Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { updateTemplate } from "@/actions/templates";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import JSZip from "jszip";
import { saveAs } from "file-saver";

type Node = {
  name: string;
  type: "folder" | "file";
  children?: Node[];
  content?: string;
  _id?: string;
  _expanded?: boolean;
};

function addIdsToTree(node: any): Node {
  return {
    ...node,
    _id: uuidv4(),
    _expanded: true,
    children: node.children?.map(addIdsToTree) || (node.type === "folder" ? [] : undefined),
  };
}

function removeIdsFromTree(node: Node): any {
  const { _id, _expanded, ...rest } = node;
  return {
    ...rest,
    children: rest.children?.map(removeIdsFromTree),
  };
}

export function TemplateBuilderClient({ initialTemplate }: { initialTemplate: any }) {
  const [template, setTemplate] = useState(initialTemplate);
  const [tree, setTree] = useState<Node>(addIdsToTree(initialTemplate.structure));
  const [saving, setSaving] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(tree._id || null);
  const [isCreateOnDiskOpen, setIsCreateOnDiskOpen] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const cleanStructure = removeIdsFromTree(tree);
      const updated = await updateTemplate(template.id, template.name, template.description || "", cleanStructure);
      setTemplate(updated);
      toast.success("Template saved");
    } catch (error) {
      toast.error("Failed to save template");
    } finally {
      setSaving(false);
    }
  };

  const handleExportZIP = async () => {
    const zip = new JSZip();
    
    const addToZip = (node: Node, currentFolder: JSZip) => {
      if (node.type === "file") {
        currentFolder.file(node.name, node.content || "");
      } else if (node.type === "folder") {
        const folder = currentFolder.folder(node.name);
        if (folder) {
          if (!node.children || node.children.length === 0) {
            folder.file(".gitkeep", "");
          } else {
            node.children.forEach(child => addToZip(child, folder));
          }
        }
      }
    };
    
    // Create root level content
    if (tree.type === "folder") {
      if (!tree.children || tree.children.length === 0) {
        zip.folder(tree.name)?.file(".gitkeep", "");
      } else {
        const rootFolder = zip.folder(tree.name);
        tree.children.forEach(child => addToZip(child, rootFolder!));
      }
    } else {
      zip.file(tree.name, tree.content || "");
    }
    
    const content = await zip.generateAsync({ type: "blob" });
    saveAs(content, `${template.name.replace(/\s+/g, '_')}.zip`);
    toast.success("Exported successfully");
  };

  const handleCreateOnDisk = async () => {
    if (!("showDirectoryPicker" in window)) {
      toast.error("Your browser doesn't support this feature. Use Chrome, Edge or Safari.");
      return;
    }
    setIsCreateOnDiskOpen(false);
    try {
      const parentDir = await (window as any).showDirectoryPicker({ mode: "readwrite" });

      const buildDir = async (node: Node, dir: FileSystemDirectoryHandle) => {
        if (node.type === "folder") {
          const subDir = await dir.getDirectoryHandle(node.name, { create: true });
          if (node.children?.length) {
            for (const child of node.children) await buildDir(child, subDir);
          } else {
            // keep empty folders visible in the OS
            const keep = await subDir.getFileHandle(".gitkeep", { create: true });
            const w = await keep.createWritable();
            await w.write("");
            await w.close();
          }
        } else {
          const fileHandle = await dir.getFileHandle(node.name, { create: true });
          const w = await fileHandle.createWritable();
          await w.write(node.content ?? "");
          await w.close();
        }
      };

      await buildDir(tree, parentDir);
      toast.success(`"${tree.name}" created in ${parentDir.name}`);
    } catch (err: any) {
      if (err.name !== "AbortError") toast.error("Failed to create folders on disk");
    }
  };

  const updateNodeDeep = (currentNode: Node, targetId: string, updateFn: (n: Node) => Node): Node => {
    if (currentNode._id === targetId) {
      return updateFn(currentNode);
    }
    if (currentNode.children) {
      return {
        ...currentNode,
        children: currentNode.children.map(c => updateNodeDeep(c, targetId, updateFn)),
      };
    }
    return currentNode;
  };

  const deleteNodeDeep = (currentNode: Node, targetId: string): Node | null => {
    if (currentNode._id === targetId) return null;
    if (currentNode.children) {
      return {
        ...currentNode,
        children: currentNode.children.map(c => deleteNodeDeep(c, targetId)).filter(Boolean) as Node[],
      };
    }
    return currentNode;
  };

  const addNode = (parentId: string, type: "folder" | "file") => {
    const newNode: Node = {
      name: type === "folder" ? "New Folder" : "new_file.txt",
      type,
      _id: uuidv4(),
      _expanded: true,
      children: type === "folder" ? [] : undefined,
    };
    
    setTree(prev => updateNodeDeep(prev, parentId, node => ({
      ...node,
      _expanded: true,
      children: [...(node.children || []), newNode],
    })));
    setSelectedNodeId(newNode._id!);
  };

  const deleteNode = (id: string) => {
    if (id === tree._id) {
      toast.error("Cannot delete root node");
      return;
    }
    setTree(prev => deleteNodeDeep(prev, id) as Node);
    if (selectedNodeId === id) setSelectedNodeId(tree._id!);
  };

  const updateNodeName = (id: string, name: string) => {
    setTree(prev => updateNodeDeep(prev, id, node => ({ ...node, name })));
  };

  const updateNodeContent = (id: string, content: string) => {
    setTree(prev => updateNodeDeep(prev, id, node => ({ ...node, content })));
  };

  const toggleExpand = (id: string) => {
    setTree(prev => updateNodeDeep(prev, id, node => ({ ...node, _expanded: !node._expanded })));
  };

  // Render tree view recursively
  const renderTree = (node: Node, depth = 0) => {
    const isSelected = selectedNodeId === node._id;
    return (
      <div key={node._id} className="w-full">
        <div
          className={`flex items-center group cursor-pointer py-1 px-2 rounded-md ${
            isSelected ? "bg-zinc-800 text-zinc-100" : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
          }`}
          style={{ paddingLeft: `${depth * 16 + 8}px` }}
          onClick={(e) => {
            e.stopPropagation();
            setSelectedNodeId(node._id!);
          }}
        >
          <div className="flex items-center flex-1">
            {node.type === "folder" ? (
              <button 
                onClick={(e) => { e.stopPropagation(); toggleExpand(node._id!); }}
                className="w-4 h-4 mr-1 flex items-center justify-center text-zinc-500 hover:text-zinc-100"
              >
                {node._expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <span className="w-4 h-4 mr-1 inline-block" /> // Spacer for files
            )}
            
            {node.type === "folder" ? (
              <Folder size={16} className={`mr-2 ${isSelected ? "text-blue-400" : "text-zinc-500"}`} />
            ) : (
              <File size={16} className={`mr-2 ${isSelected ? "text-zinc-300" : "text-zinc-500"}`} />
            )}
            
            <span className="text-sm select-none truncate max-w-[200px]">{node.name}</span>
          </div>
          
          <div className={`flex items-center opacity-0 group-hover:opacity-100 ${isSelected ? "opacity-100" : ""}`}>
            {node.type === "folder" && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); addNode(node._id!, "file"); }}
                  className="p-1 hover:text-white text-zinc-500"
                  title="New File"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); addNode(node._id!, "folder"); }}
                  className="p-1 hover:text-white text-zinc-500"
                  title="New Folder"
                >
                  <Folder size={14} />
                </button>
              </>
            )}
            {node._id !== tree._id && (
              <button
                onClick={(e) => { e.stopPropagation(); deleteNode(node._id!); }}
                className="p-1 hover:text-red-400 text-zinc-500"
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        </div>
        
        {node.type === "folder" && node._expanded && node.children && (
          <div className="w-full">
            {node.children.map(child => renderTree(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  // Find currently selected node for editing
  let selectedNode: Node | null = null;
  const findSelected = (n: Node) => {
    if (n._id === selectedNodeId) selectedNode = n;
    if (n.children) n.children.forEach(findSelected);
  };
  findSelected(tree);

  return (
    <div className="flex flex-col h-full space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{template.name}</h1>
          <p className="text-sm text-zinc-400">{template.description || "No description provided."}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setIsCreateOnDiskOpen(true)} className="bg-zinc-950 border-zinc-800">
            <FolderOpen className="mr-2 h-4 w-4" /> Create on Disk
          </Button>
          <Button variant="outline" onClick={handleExportZIP} className="bg-zinc-950 border-zinc-800">
            <FileArchive className="mr-2 h-4 w-4" /> Export ZIP
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" /> {saving ? "Saving..." : "Save Template"}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden border border-zinc-800 rounded-lg bg-zinc-900">
        <div className="w-1/3 min-w-[250px] border-r border-zinc-800 flex flex-col bg-zinc-950/50">
          <div className="p-3 border-b border-zinc-800 text-sm font-medium text-zinc-300">
            Project Structure
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            {renderTree(tree)}
          </div>
        </div>
        
        <div className="flex-1 flex flex-col bg-zinc-900">
          {selectedNode ? (
            <div className="p-6 flex flex-col h-full">
              <h2 className="text-lg font-semibold mb-6 flex items-center">
                {selectedNode.type === "folder" ? <Folder className="mr-2 text-blue-400" /> : <File className="mr-2 text-zinc-300" />}
                Edit {selectedNode.type === "folder" ? "Folder" : "File"}
              </h2>
              
              <div className="space-y-4 flex-1 flex flex-col">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-zinc-300">Name</label>
                  <Input 
                    value={selectedNode.name} 
                    onChange={(e) => updateNodeName(selectedNodeId!, e.target.value)}
                    className="bg-zinc-950 border-zinc-800 w-full max-w-md"
                  />
                </div>
                
                {selectedNode.type === "file" && (
                  <div className="space-y-2 flex-1 flex flex-col">
                    <label className="text-sm font-medium text-zinc-300 flex justify-between items-center">
                      Content
                      <FileCode className="h-4 w-4 text-zinc-500" />
                    </label>
                    <textarea 
                      className="w-full flex-1 p-3 bg-zinc-950 border border-zinc-800 rounded-md font-mono text-sm text-zinc-300 resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
                      value={selectedNode.content || ""}
                      onChange={(e) => updateNodeContent(selectedNodeId!, e.target.value)}
                      placeholder="Enter file content here..."
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 flex-col">
              <FolderTree className="h-12 w-12 mb-4 opacity-50" />
              <p>Select a file or folder to edit</p>
            </div>
          )}
        </div>
      </div>

      <Dialog open={isCreateOnDiskOpen} onOpenChange={setIsCreateOnDiskOpen}>
        <DialogContent className="sm:max-w-[420px] bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5 text-zinc-400" />
              Create Folder Structure on Disk
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              You'll choose where to create <span className="text-zinc-200 font-medium">"{tree.name}"</span> on your computer. The browser will ask permission to write files — click <span className="text-zinc-200 font-medium">Allow</span> when prompted.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOnDiskOpen(false)} className="bg-zinc-950 border-zinc-700">
              Cancel
            </Button>
            <Button onClick={handleCreateOnDisk}>
              <FolderOpen className="mr-2 h-4 w-4" /> Choose Location
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
