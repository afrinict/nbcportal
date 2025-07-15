import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { GripVertical, Plus, Edit, Trash2, Save, X, ArrowRight, CheckCircle, Clock, AlertCircle, Eye, BarChart3, Copy, Download, Upload, Settings, Users, FileText, Calendar } from 'lucide-react';

interface WorkflowStage {
  id: number;
  name: string;
  description: string;
  order: number;
  isActive: boolean;
  estimatedDuration: number;
  requiredDocuments: string[];
  assignedRole: string;
  canReject: boolean;
  canApprove: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

interface CreateWorkflowStage {
  name: string;
  description: string;
  order: number;
  estimatedDuration: number;
  requiredDocuments: string[];
  assignedRole: string;
  canReject: boolean;
  canApprove: boolean;
}

interface WorkflowTemplate {
  name: string;
  description: string;
  stages: CreateWorkflowStage[];
}

const WORKFLOW_TEMPLATES: WorkflowTemplate[] = [
  {
    name: "Standard License Application",
    description: "Complete workflow for standard broadcasting license applications",
    stages: [
      {
        name: "Document Review",
        description: "Initial review of submitted documents and verification of completeness",
        order: 1,
        estimatedDuration: 3,
        requiredDocuments: ["Application Form", "Business Registration", "Technical Specifications"],
        assignedRole: "reviewer",
        canReject: true,
        canApprove: false
      },
      {
        name: "Technical Assessment",
        description: "Technical evaluation of broadcasting equipment and facilities",
        order: 2,
        estimatedDuration: 5,
        requiredDocuments: ["Equipment Specifications", "Site Survey Report", "Frequency Analysis"],
        assignedRole: "inspector",
        canReject: true,
        canApprove: false
      },
      {
        name: "Compliance Check",
        description: "Verification of regulatory compliance and legal requirements",
        order: 3,
        estimatedDuration: 2,
        requiredDocuments: ["Compliance Certificate", "Legal Opinion", "Regulatory Clearance"],
        assignedRole: "reviewer",
        canReject: true,
        canApprove: false
      },
      {
        name: "Final Approval",
        description: "Final review and approval decision by senior management",
        order: 4,
        estimatedDuration: 1,
        requiredDocuments: ["Final Report", "Recommendation Letter"],
        assignedRole: "approver",
        canReject: true,
        canApprove: true
      }
    ]
  },
  {
    name: "Fast Track Application",
    description: "Streamlined workflow for expedited license processing",
    stages: [
      {
        name: "Quick Review",
        description: "Rapid assessment of essential documents",
        order: 1,
        estimatedDuration: 1,
        requiredDocuments: ["Application Form", "Basic Requirements"],
        assignedRole: "reviewer",
        canReject: true,
        canApprove: false
      },
      {
        name: "Expedited Approval",
        description: "Fast-track approval process",
        order: 2,
        estimatedDuration: 1,
        requiredDocuments: ["Expedited Review Report"],
        assignedRole: "approver",
        canReject: true,
        canApprove: true
      }
    ]
  }
];

export default function WorkflowBuilder() {
  const [stages, setStages] = useState<WorkflowStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<WorkflowStage | null>(null);
  const [formData, setFormData] = useState<CreateWorkflowStage>({
    name: '',
    description: '',
    order: 1,
    estimatedDuration: 1,
    requiredDocuments: [],
    assignedRole: '',
    canReject: false,
    canApprove: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchStages();
  }, []);

  const fetchStages = async () => {
    try {
      const response = await fetch('/api/workflow-stages', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setStages(data.sort((a: WorkflowStage, b: WorkflowStage) => a.order - b.order));
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch workflow stages",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching stages:', error);
      toast({
        title: "Error",
        description: "Failed to fetch workflow stages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingStage 
        ? `/api/workflow-stages/${editingStage.id}`
        : '/api/workflow-stages';
      
      const method = editingStage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: editingStage 
            ? "Workflow stage updated successfully" 
            : "Workflow stage created successfully"
        });
        setIsCreateDialogOpen(false);
        setEditingStage(null);
        resetForm();
        fetchStages();
      } else {
        const error = await response.json();
        toast({
          title: "Error",
          description: error.message || "Failed to save workflow stage",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error saving stage:', error);
      toast({
        title: "Error",
        description: "Failed to save workflow stage",
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/workflow-stages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Workflow stage deleted successfully"
        });
        fetchStages();
      } else {
        toast({
          title: "Error",
          description: "Failed to delete workflow stage",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast({
        title: "Error",
        description: "Failed to delete workflow stage",
        variant: "destructive"
      });
    }
  };

  const handleEdit = (stage: WorkflowStage) => {
    setEditingStage(stage);
    setFormData({
      name: stage.name,
      description: stage.description,
      order: stage.order,
      estimatedDuration: stage.estimatedDuration,
      requiredDocuments: stage.requiredDocuments,
      assignedRole: stage.assignedRole,
      canReject: stage.canReject,
      canApprove: stage.canApprove
    });
    setIsCreateDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      order: 1,
      estimatedDuration: 1,
      requiredDocuments: [],
      assignedRole: '',
      canReject: false,
      canApprove: false
    });
  };

  const addRequiredDocument = () => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: [...prev.requiredDocuments, '']
    }));
  };

  const updateRequiredDocument = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.map((doc, i) => 
        i === index ? value : doc
      )
    }));
  };

  const removeRequiredDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_, i) => i !== index)
    }));
  };

  const getStageIcon = (stage: WorkflowStage) => {
    if (stage.canApprove) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (stage.canReject) return <AlertCircle className="w-5 h-5 text-red-600" />;
    return <Clock className="w-5 h-5 text-blue-600" />;
  };

  const getStageColor = (stage: WorkflowStage) => {
    if (stage.canApprove) return "border-green-200 bg-green-50";
    if (stage.canReject) return "border-red-200 bg-red-50";
    return "border-blue-200 bg-blue-50";
  };

  const applyTemplate = async (template: WorkflowTemplate) => {
    try {
      // Clear existing stages first
      for (const stage of stages) {
        await handleDelete(stage.id);
      }

      // Create new stages from template
      for (const stage of template.stages) {
        const response = await fetch('/api/workflow-stages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(stage)
        });

        if (!response.ok) {
          throw new Error(`Failed to create stage: ${stage.name}`);
        }
      }

      toast({
        title: "Success",
        description: `Applied template: ${template.name}`
      });
      
      setIsTemplateDialogOpen(false);
      fetchStages();
    } catch (error) {
      console.error('Error applying template:', error);
      toast({
        title: "Error",
        description: "Failed to apply template",
        variant: "destructive"
      });
    }
  };

  const getWorkflowStats = () => {
    const totalStages = stages.length;
    const activeStages = stages.filter(s => s.isActive).length;
    const totalDuration = stages.reduce((sum, s) => sum + s.estimatedDuration, 0);
    const approvalStages = stages.filter(s => s.canApprove).length;
    const rejectionStages = stages.filter(s => s.canReject).length;

    return {
      totalStages,
      activeStages,
      totalDuration,
      approvalStages,
      rejectionStages
    };
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading workflow stages...</div>
        </div>
      </div>
    );
  }

  const stats = getWorkflowStats();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Workflow Management</h1>
          <p className="text-muted-foreground">
            Design and manage application processing workflows
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Workflow Templates</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {WORKFLOW_TEMPLATES.map((template, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <FileText className="w-4 h-4" />
                          {template.stages.length} stages
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="w-4 h-4" />
                          {template.stages.reduce((sum, s) => sum + s.estimatedDuration, 0)} days total
                        </div>
                        <Button 
                          onClick={() => applyTemplate(template)}
                          className="w-full"
                        >
                          Apply Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingStage(null);
                resetForm();
              }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Stage
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingStage ? 'Edit Workflow Stage' : 'Create Workflow Stage'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Stage Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Document Review"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="order">Order *</Label>
                    <Input
                      id="order"
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData(prev => ({ ...prev, order: parseInt(e.target.value) }))}
                      min="1"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe what happens in this stage..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="estimatedDuration">Estimated Duration (days)</Label>
                    <Input
                      id="estimatedDuration"
                      type="number"
                      value={formData.estimatedDuration}
                      onChange={(e) => setFormData(prev => ({ ...prev, estimatedDuration: parseInt(e.target.value) }))}
                      min="1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="assignedRole">Assigned Role</Label>
                    <Select
                      value={formData.assignedRole}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, assignedRole: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="reviewer">Reviewer</SelectItem>
                        <SelectItem value="approver">Approver</SelectItem>
                        <SelectItem value="inspector">Inspector</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Required Documents</Label>
                  {formData.requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={doc}
                        onChange={(e) => updateRequiredDocument(index, e.target.value)}
                        placeholder="Document name"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeRequiredDocument(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addRequiredDocument}
                    className="w-full"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Required Document
                  </Button>
                </div>

                <div className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canApprove"
                      checked={formData.canApprove}
                      onChange={(e) => setFormData(prev => ({ ...prev, canApprove: e.target.checked }))}
                    />
                    <Label htmlFor="canApprove">Can Approve</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="canReject"
                      checked={formData.canReject}
                      onChange={(e) => setFormData(prev => ({ ...prev, canReject: e.target.checked }))}
                    />
                    <Label htmlFor="canReject">Can Reject</Label>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsCreateDialogOpen(false);
                      setEditingStage(null);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">
                    <Save className="w-4 h-4 mr-2" />
                    {editingStage ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Total Stages</p>
                <p className="text-2xl font-bold">{stats.totalStages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Active Stages</p>
                <p className="text-2xl font-bold">{stats.activeStages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Total Duration</p>
                <p className="text-2xl font-bold">{stats.totalDuration} days</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Approval Stages</p>
                <p className="text-2xl font-bold">{stats.approvalStages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-600" />
              <div>
                <p className="text-sm font-medium">Rejection Stages</p>
                <p className="text-2xl font-bold">{stats.rejectionStages}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="visualization" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualization">Workflow Visualization</TabsTrigger>
          <TabsTrigger value="stages">Stage Management</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Workflow Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {stages.length > 0 ? (
                <div className="flex flex-col space-y-4">
                  {stages.map((stage, index) => (
                    <div key={stage.id} className="flex items-center">
                      <div className={`flex-1 p-4 rounded-lg border ${getStageColor(stage)}`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStageIcon(stage)}
                            <div>
                              <h3 className="font-semibold">{stage.name}</h3>
                              <p className="text-sm text-muted-foreground">
                                {stage.description}
                              </p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="outline">{stage.assignedRole}</Badge>
                                <Badge variant="outline">{stage.estimatedDuration} days</Badge>
                                {stage.canApprove && <Badge variant="outline" className="bg-green-100 text-green-800">Can Approve</Badge>}
                                {stage.canReject && <Badge variant="outline" className="bg-red-100 text-red-800">Can Reject</Badge>}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={stage.isActive ? "default" : "secondary"}>
                              {stage.isActive ? "Active" : "Inactive"}
                            </Badge>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleEdit(stage)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                      {index < stages.length - 1 && (
                        <div className="mx-4">
                          <ArrowRight className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">No Workflow Stages</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first workflow stage to visualize the process
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Stage
                    </Button>
                    <Button variant="outline" onClick={() => setIsTemplateDialogOpen(true)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stages" className="space-y-4">
          <div className="grid gap-4">
            {stages.map((stage) => (
              <Card key={stage.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <GripVertical className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">{stage.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          Order: {stage.order} • Duration: {stage.estimatedDuration} days
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={stage.isActive ? "default" : "secondary"}>
                        {stage.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEdit(stage)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Workflow Stage</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{stage.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(stage.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stage.description && (
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">Role: {stage.assignedRole}</Badge>
                      {stage.canApprove && <Badge variant="outline">Can Approve</Badge>}
                      {stage.canReject && <Badge variant="outline">Can Reject</Badge>}
                    </div>

                    {stage.requiredDocuments.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-1">Required Documents:</p>
                        <div className="flex flex-wrap gap-1">
                          {stage.requiredDocuments.map((doc, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {stages.length === 0 && (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-2">No Workflow Stages</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first workflow stage to get started
                  </p>
                  <div className="flex gap-2 justify-center">
                    <Button onClick={() => setIsCreateDialogOpen(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add First Stage
                    </Button>
                    <Button variant="outline" onClick={() => setIsTemplateDialogOpen(true)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                Workflow Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Export Workflow</Label>
                  <Button variant="outline" className="w-full mt-2">
                    <Download className="w-4 h-4 mr-2" />
                    Export as JSON
                  </Button>
                </div>
                <div>
                  <Label>Import Workflow</Label>
                  <Button variant="outline" className="w-full mt-2">
                    <Upload className="w-4 h-4 mr-2" />
                    Import from JSON
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Workflow Templates</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Use predefined templates to quickly set up common workflow patterns
                </p>
                <Button onClick={() => setIsTemplateDialogOpen(true)}>
                  <Copy className="w-4 h-4 mr-2" />
                  Browse Templates
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 