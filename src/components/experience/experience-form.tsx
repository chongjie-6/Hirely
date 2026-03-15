"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  experienceSchema,
  type ExperienceFormData,
} from "@/lib/validators/schemas";
import {
  addExperience,
  updateExperience,
  deleteExperience,
} from "@/services/actions";
import { formatDateRange } from "@/lib/utils";
import type { Experience } from "@/types/database";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { MonthPicker } from "@/components/ui/month-picker";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

export default function ExperienceList({
  experiences: initialExperiences,
}: {
  experiences: Experience[];
}) {
  const [experiences, setExperiences] = useState(initialExperiences);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCurrent, setIsCurrent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: { is_current: false },
  });

  const startEditing = (exp: Experience) => {
    setEditingId(exp.id);
    setShowForm(true);
    setIsCurrent(exp.is_current);
    reset({
      company: exp.company,
      title: exp.title,
      start_date: exp.start_date ?? "",
      end_date: exp.end_date ?? "",
      is_current: exp.is_current,
      description: exp.description ?? "",
    });
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setIsCurrent(false);
    reset({
      company: "",
      title: "",
      start_date: "",
      end_date: "",
      is_current: false,
      description: "",
    });
  };

  const onSubmit = async (data: ExperienceFormData) => {
    try {
      if (editingId) {
        const updated = await updateExperience(editingId, data);
        setExperiences((prev) =>
          prev.map((e) => (e.id === editingId ? updated : e)),
        );
        toast.success("Experience updated");
      } else {
        const added = await addExperience({
          ...data,
          sort_order: experiences.length,
        });
        setExperiences((prev) => [...prev, added]);
        toast.success("Experience added");
      }
      cancelForm();
    } catch {
      toast.error("Failed to save experience");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this experience?")) return;
    try {
      await deleteExperience(id);
      setExperiences((prev) => prev.filter((e) => e.id !== id));
      toast.success("Experience deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Work Experience</h2>
          <p className="text-base text-muted-foreground">
            {experiences.length} entries
          </p>
        </div>
        {!showForm && (
          <Button
            onClick={() => {
              setShowForm(true);
              setEditingId(null);
              setIsCurrent(false);
              reset({
                company: "",
                title: "",
                start_date: "",
                end_date: "",
                is_current: false,
                description: "",
              });
            }}
          >
            <Plus className="size-4 mr-1" /> Add Experience
          </Button>
        )}
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{editingId ? "Edit" : "Add"} Experience</CardTitle>
              <Button variant="ghost" size="icon" onClick={cancelForm}>
                <X className="size-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input id="company" {...register("company")} />
                  {errors.company && (
                    <p className="text-base text-destructive">
                      {errors.company.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="title">Job Title</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && (
                    <p className="text-base text-destructive">
                      {errors.title.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Controller
                    control={control}
                    name="start_date"
                    render={({ field }) => (
                      <MonthPicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Select start"
                      />
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Controller
                    control={control}
                    name="end_date"
                    render={({ field }) => (
                      <MonthPicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isCurrent}
                        placeholder="Select end"
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="is_current"
                    render={({ field }) => (
                      <label className="flex items-center gap-2 text-base text-muted-foreground cursor-pointer">
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                            setIsCurrent(checked === true);
                          }}
                          className="rounded-full"
                        />
                        I currently work here
                      </label>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder={
                    "• Led a team of 5 engineers...\n• Increased revenue by 20%..."
                  }
                  rows={5}
                  {...register("description")}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={cancelForm}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <Loader2 className="size-4 animate-spin mr-2" />
                  ) : null}
                  {editingId ? "Update" : "Add"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {experiences.length === 0 && !showForm && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No work experience added yet.
            </p>
            <p className="text-base text-muted-foreground/60 mt-1">
              Click &quot;Add Experience&quot; to get started.
            </p>
          </CardContent>
        </Card>
      )}

      {experiences.map((exp) => (
        <Card key={exp.id}>
          <CardContent>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{exp.title}</h3>
                <p className="text-muted-foreground">{exp.company}</p>
                <p className="text-base text-muted-foreground/60 mt-1">
                  {formatDateRange(
                    exp.start_date,
                    exp.end_date,
                    exp.is_current,
                  )}
                </p>
                {exp.description && (
                  <div className="mt-3 text-base whitespace-pre-line">
                    {exp.description}
                  </div>
                )}
              </div>
              <div className="flex gap-1 ml-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => startEditing(exp)}
                >
                  <Pencil className="size-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(exp.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
