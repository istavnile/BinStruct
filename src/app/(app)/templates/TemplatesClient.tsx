"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoreHorizontal, Plus, FileArchive, Edit, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { createTemplate, deleteTemplate } from "@/actions/templates";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

const BASE_STRUCTURE = {
  name: "[NOMBRE_DEL_PROYECTO]",
  type: "folder",
  children: [
    { name: "01_MEDIA", type: "folder", children: [
      { name: "01_VIDEO_RAW", type: "folder", children: [] },
      { name: "02_AUDIO_RAW", type: "folder", children: [] },
      { name: "03_VOICE_OVER", type: "folder", children: [] },
      { name: "04_PROXIES", type: "folder", children: [] },
      { name: "05_MUSIC", type: "folder", children: [] },
      { name: "06_SFX", type: "folder", children: [] },
      { name: "07_STOCK_IMAGES", type: "folder", children: [] },
      { name: "08_BRAND_ASSETS", type: "folder", children: [] },
    ]},
    { name: "02_PROJECT_FILES", type: "folder", children: [
      { name: "01_EDIT", type: "folder", children: [] },
      { name: "02_VFX_GFX", type: "folder", children: [] },
      { name: "03_COLOR_BACKUPS", type: "folder", children: [] },
      { name: "04_DESIGN", type: "folder", children: [] },
    ]},
    { name: "03_DOCUMENTS", type: "folder", children: [
      { name: "01_SCRIPTS", type: "folder", children: [] },
      { name: "02_BRIEFS_AND_SPECS", type: "folder", children: [] },
    ]},
    { name: "04_EXCHANGE", type: "folder", children: [
      { name: "01_XML_AAF_EDL", type: "folder", children: [] },
      { name: "02_TO_COLOR", type: "folder", children: [] },
      { name: "03_FROM_COLOR", type: "folder", children: [] },
      { name: "04_TO_VFX", type: "folder", children: [] },
      { name: "05_FROM_VFX", type: "folder", children: [] },
    ]},
    { name: "05_DELIVERY", type: "folder", children: [
      { name: "01_LOSSLESS_MASTERS", type: "folder", children: [] },
      { name: "02_COMPRESSED", type: "folder", children: [] },
    ]},
    { name: "06_FONTS", type: "folder", children: [] },
  ],
};

export function TemplatesClient({ initialTemplates }: { initialTemplates: any[] }) {
  const router = useRouter();
  const [templates, setTemplates] = useState(initialTemplates);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [newTemplateDescription, setNewTemplateDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<{ id: string; name: string } | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const initialStructure = BASE_STRUCTURE;
      const newTemplate = await createTemplate(newTemplateName, newTemplateDescription, initialStructure);
      toast.success("Template created successfully");
      setIsCreateOpen(false);
      router.push(`/templates/${newTemplate.id}`);
    } catch (error) {
      toast.error("Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!templateToDelete) return;
    try {
      await deleteTemplate(templateToDelete.id);
      setTemplates(templates.filter(t => t.id !== templateToDelete.id));
      toast.success("Template deleted");
      setTemplateToDelete(null);
    } catch (error) {
      toast.error("Failed to delete template");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
          <p className="text-zinc-400 mt-2">Manage your folder structure templates.</p>
        </div>

        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Template
        </Button>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogContent className="sm:max-w-[425px] bg-zinc-900 border-zinc-800 text-zinc-100">
            <form onSubmit={handleCreate}>
              <DialogHeader>
                <DialogTitle>Create Template</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Give your new folder structure template a name and description.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    required
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Input
                    id="description"
                    value={newTemplateDescription}
                    onChange={(e) => setNewTemplateDescription(e.target.value)}
                    className="bg-zinc-950 border-zinc-800"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={loading}>
                  {loading ? "Creating..." : "Create"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>

      <div className="rounded-md border border-zinc-800 bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Description</TableHead>
              <TableHead className="text-zinc-400">Updated</TableHead>
              <TableHead className="w-[100px] text-right text-zinc-400">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {templates.length === 0 ? (
              <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                <TableCell colSpan={4} className="text-center py-8 text-zinc-500">
                  No templates found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : (
              templates.map((template) => (
                <TableRow key={template.id} className="border-zinc-800 hover:bg-zinc-800/50">
                  <TableCell className="font-medium text-zinc-100">{template.name}</TableCell>
                  <TableCell className="text-zinc-400">{template.description}</TableCell>
                  <TableCell className="text-zinc-400">
                    {formatDistanceToNow(new Date(template.updatedAt), { addSuffix: true })}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <DropdownMenuItem
                          className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                          onClick={() => router.push(`/templates/${template.id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Structure
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="hover:bg-zinc-800 focus:bg-zinc-800 focus:text-zinc-100 cursor-pointer"
                          onClick={() => {
                            // Client-side ZIP generation could be triggered here or inside the builder.
                            // We will implement it in the builder.
                            router.push(`/templates/${template.id}?export=true`);
                          }}
                        >
                          <FileArchive className="mr-2 h-4 w-4" />
                          Export to ZIP
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-500 hover:bg-zinc-800 focus:bg-zinc-800 focus:text-red-400 cursor-pointer"
                          onClick={() => setTemplateToDelete({ id: template.id, name: template.name })}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!templateToDelete} onOpenChange={(open) => { if (!open) setTemplateToDelete(null); }}>
        <DialogContent className="sm:max-w-[400px] bg-zinc-900 border-zinc-800 text-zinc-100">
          <DialogHeader>
            <DialogTitle>Delete Template</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Are you sure you want to delete <span className="text-zinc-200 font-medium">{templateToDelete?.name}</span>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setTemplateToDelete(null)} className="bg-zinc-950 border-zinc-700">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
