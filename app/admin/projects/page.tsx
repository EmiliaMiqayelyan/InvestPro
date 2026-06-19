"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderKanban, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DataTable, type Column } from "@/components/shared/data-table";
import { DataTableSkeleton } from "@/components/shared/loading-skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { PROJECT_CATEGORIES, QUERY_KEYS } from "@/constants";
import { projectsApi } from "@/services/api";
import { formatCurrency } from "@/utils/format";
import { getErrorMessage } from "@/services/api/client";
import { toast } from "sonner";
import type { Project, ProjectStatus, RiskLevel } from "@/types";

export default function AdminProjectsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({
    title: "",
    category: "Technology",
    description: "",
    fullDescription: "",
    image: "",
    fundingGoal: 100000,
    roiPercentage: 10,
    investmentPeriod: 90,
    riskLevel: "medium" as RiskLevel,
    status: "active" as ProjectStatus,
    minInvestment: 100,
    maxInvestment: 50000,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 90 * 86400000).toISOString().split("T")[0],
  });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROJECTS, "admin"],
    queryFn: async () => {
      const { data } = await projectsApi.getAll({ limit: 100 });
      return data.data;
    },
  });

  const createMutation = useMutation({
    mutationFn: () => projectsApi.create(form),
    onSuccess: () => {
      toast.success("Project created");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
      setShowCreate(false);
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => projectsApi.delete(id),
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PROJECTS] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  const columns: Column<Project>[] = [
    { key: "title", header: "Title", cell: (p) => p.title },
    { key: "category", header: "Category", cell: (p) => p.category },
    { key: "goal", header: "Goal", cell: (p) => formatCurrency(p.fundingGoal) },
    { key: "roi", header: "ROI", cell: (p) => `${p.roiPercentage}%` },
    { key: "status", header: "Status", cell: (p) => <Badge variant={p.status}>{p.status}</Badge> },
    {
      key: "actions",
      header: "Actions",
      cell: (p) => (
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteMutation.mutate(p.id)}
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Project Management</h1>
          <p className="text-muted-foreground">Create and manage investment projects</p>
        </div>
        <Button variant="gradient" onClick={() => setShowCreate(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Project
        </Button>
      </div>

      {isLoading ? (
        <DataTableSkeleton />
      ) : data?.data.length ? (
        <DataTable columns={columns} data={data.data} keyExtractor={(p) => p.id} />
      ) : (
        <EmptyState icon={FolderKanban} title="No projects" description="Create your first project" />
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PROJECT_CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Funding Goal</Label>
                <Input type="number" value={form.fundingGoal} onChange={(e) => setForm({ ...form, fundingGoal: +e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>ROI %</Label>
                <Input type="number" value={form.roiPercentage} onChange={(e) => setForm({ ...form, roiPercentage: +e.target.value })} />
              </div>
            </div>
            <Button variant="gradient" className="w-full" onClick={() => createMutation.mutate()} disabled={createMutation.isPending}>
              Create Project
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
