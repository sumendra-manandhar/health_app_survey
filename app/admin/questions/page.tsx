"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Trash2,
  Save,
  Eye,
  Settings,
  ArrowLeft,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { QuestionLoader } from "@/lib/question-loader";

interface Question {
  id: string;
  label: string;
  labelEn?: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: Array<{ value: string; label: string; labelEn?: string }>;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

interface FormStep {
  id: string;
  title: { nepali: string; english: string };
  description: { nepali: string; english: string };
  questions: Question[];
}

export default function QuestionsAdminPage() {
  const [steps, setSteps] = useState<FormStep[]>([]);
  const [activeStep, setActiveStep] = useState<string>("");
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      await QuestionLoader.loadQuestions();
      const loadedSteps = QuestionLoader.getAllSteps();
      setSteps(
        loadedSteps.map((step) => ({
          id: step.stepId,
          title: step.title,
          description: step.description,
          questions: step.questions,
        }))
      );
      if (loadedSteps.length > 0) {
        setActiveStep(loadedSteps[0].stepId);
      }
    } catch (error) {
      console.error("Error loading questions:", error);
      setMessage({
        type: "error",
        text: "प्रश्नहरू लोड गर्न सकिएन | Failed to load questions",
      });
    }
  };

  const addNewStep = () => {
    const newStepId = `step${steps.length + 1}`;
    const newStep: FormStep = {
      id: newStepId,
      title: {
        nepali: `चरण ${steps.length + 1}`,
        english: `Step ${steps.length + 1}`,
      },
      description: { nepali: "नयाँ चरण", english: "New step" },
      questions: [],
    };
    setSteps([...steps, newStep]);
    setActiveStep(newStepId);
  };

  const addNewQuestion = (stepId: string) => {
    const newQuestion: Question = {
      id: `question_${Date.now()}`,
      label: "नयाँ प्रश्न",
      labelEn: "New Question",
      type: "text",
      required: false,
      placeholder: "",
    };

    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? { ...step, questions: [...step.questions, newQuestion] }
          : step
      )
    );
  };

  const updateQuestion = (
    stepId: string,
    questionId: string,
    updates: Partial<Question>
  ) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              questions: step.questions.map((q) =>
                q.id === questionId ? { ...q, ...updates } : q
              ),
            }
          : step
      )
    );
  };

  const deleteQuestion = (stepId: string, questionId: string) => {
    setSteps(
      steps.map((step) =>
        step.id === stepId
          ? {
              ...step,
              questions: step.questions.filter((q) => q.id !== questionId),
            }
          : step
      )
    );
  };

  const updateStep = (stepId: string, updates: Partial<FormStep>) => {
    setSteps(
      steps.map((step) => (step.id === stepId ? { ...step, ...updates } : step))
    );
  };

  const saveQuestions = async () => {
    try {
      setSaving(true);
      const response = await fetch("/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ steps }),
      });

      if (response.ok) {
        setMessage({
          type: "success",
          text: "प्रश्नहरू सफलतापूर्वक सुरक्षित भयो | Questions saved successfully",
        });
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Error saving questions:", error);
      setMessage({
        type: "error",
        text: "प्रश्नहरू सुरक्षित गर्न सकिएन | Failed to save questions",
      });
    } finally {
      setSaving(false);
    }
  };

  const activeStepData = steps.find((step) => step.id === activeStep);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/register">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                फिर्ता
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                प्रश्न व्यवस्थापन | Question Management
              </h1>
              <p className="text-gray-600">
                दर्ता फारमका प्रश्नहरू व्यवस्थापन गर्नुहोस् | Manage
                registration form questions
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-2" />
              {previewMode ? "सम्पादन | Edit" : "पूर्वावलोकन | Preview"}
            </Button>
            <Button onClick={saveQuestions} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "सुरक्षित गर्दै..." : "सुरक्षित गर्नुहोस्"}
            </Button>
          </div>
        </div>

        {/* Message */}
        {message && (
          <Alert
            className={`mb-6 ${
              message.type === "success" ? "border-green-500" : "border-red-500"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Steps Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>चरणहरू | Steps</span>
                  <Button size="sm" onClick={addNewStep}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {steps.map((step) => (
                  <Button
                    key={step.id}
                    variant={activeStep === step.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setActiveStep(step.id)}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    {step.title.nepali}
                    <Badge variant="secondary" className="ml-auto">
                      {step.questions.length}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeStepData && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>
                        {activeStepData.title.nepali} |{" "}
                        {activeStepData.title.english}
                      </CardTitle>
                      <CardDescription>
                        {activeStepData.description.nepali}
                      </CardDescription>
                    </div>
                    <Button onClick={() => addNewQuestion(activeStep)}>
                      <Plus className="h-4 w-4 mr-2" />
                      प्रश्न थप्नुहोस्
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Step Settings */}
                  {!previewMode && (
                    <div className="p-4 bg-gray-50 rounded-lg space-y-4">
                      <h3 className="font-semibold">
                        चरण सेटिङ्गहरू | Step Settings
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>नेपाली शीर्षक | Nepali Title</Label>
                          <Input
                            value={activeStepData.title.nepali}
                            onChange={(e) =>
                              updateStep(activeStep, {
                                title: {
                                  ...activeStepData.title,
                                  nepali: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>English Title</Label>
                          <Input
                            value={activeStepData.title.english}
                            onChange={(e) =>
                              updateStep(activeStep, {
                                title: {
                                  ...activeStepData.title,
                                  english: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>नेपाली विवरण | Nepali Description</Label>
                          <Input
                            value={activeStepData.description.nepali}
                            onChange={(e) =>
                              updateStep(activeStep, {
                                description: {
                                  ...activeStepData.description,
                                  nepali: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>English Description</Label>
                          <Input
                            value={activeStepData.description.english}
                            onChange={(e) =>
                              updateStep(activeStep, {
                                description: {
                                  ...activeStepData.description,
                                  english: e.target.value,
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  <div className="space-y-4">
                    {activeStepData.questions.map((question, index) => (
                      <Card
                        key={question.id}
                        className="border-l-4 border-l-blue-500"
                      >
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">#{index + 1}</Badge>
                              <span className="font-medium">
                                {question.label}
                              </span>
                              {question.required && (
                                <Badge
                                  variant="destructive"
                                  className="text-xs"
                                >
                                  आवश्यक
                                </Badge>
                              )}
                            </div>
                            {!previewMode && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  deleteQuestion(activeStep, question.id)
                                }
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {previewMode ? (
                            // Preview Mode - Show how the question will look
                            <div className="space-y-2">
                              <Label>
                                {question.label}
                                {question.labelEn && (
                                  <span className="text-gray-500 ml-2">
                                    | {question.labelEn}
                                  </span>
                                )}
                                {question.required && (
                                  <span className="text-red-500 ml-1">*</span>
                                )}
                              </Label>

                              {question.type === "text" && (
                                <Input
                                  placeholder={question.placeholder}
                                  disabled
                                />
                              )}
                              {question.type === "number" && (
                                <Input
                                  type="number"
                                  placeholder={question.placeholder}
                                  disabled
                                />
                              )}
                              {question.type === "date" && (
                                <Input type="date" disabled />
                              )}
                              {question.type === "textarea" && (
                                <Textarea
                                  placeholder={question.placeholder}
                                  disabled
                                />
                              )}
                              {question.type === "select" && (
                                <Select disabled>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={`${question.label} छान्नुहोस्`}
                                    />
                                  </SelectTrigger>
                                </Select>
                              )}
                              {question.type === "checkbox" &&
                                question.options && (
                                  <div className="space-y-2">
                                    {question.options.map((option) => (
                                      <div
                                        key={option.value}
                                        className="flex items-center space-x-2"
                                      >
                                        <Checkbox disabled />
                                        <Label>{option.label}</Label>
                                      </div>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ) : (
                            // Edit Mode - Show question configuration
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>नेपाली लेबल | Nepali Label</Label>
                                <Input
                                  value={question.label}
                                  onChange={(e) =>
                                    updateQuestion(activeStep, question.id, {
                                      label: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>English Label</Label>
                                <Input
                                  value={question.labelEn || ""}
                                  onChange={(e) =>
                                    updateQuestion(activeStep, question.id, {
                                      labelEn: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>प्रकार | Type</Label>
                                <Select
                                  value={question.type}
                                  onValueChange={(value) =>
                                    updateQuestion(activeStep, question.id, {
                                      type: value,
                                    })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="text">Text</SelectItem>
                                    <SelectItem value="number">
                                      Number
                                    </SelectItem>
                                    <SelectItem value="date">Date</SelectItem>
                                    <SelectItem value="textarea">
                                      Textarea
                                    </SelectItem>
                                    <SelectItem value="select">
                                      Select
                                    </SelectItem>
                                    <SelectItem value="radio">Radio</SelectItem>
                                    <SelectItem value="checkbox">
                                      Checkbox
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label>Placeholder</Label>
                                <Input
                                  value={question.placeholder || ""}
                                  onChange={(e) =>
                                    updateQuestion(activeStep, question.id, {
                                      placeholder: e.target.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="flex items-center space-x-2">
                                <Checkbox
                                  checked={question.required}
                                  onCheckedChange={(checked) =>
                                    updateQuestion(activeStep, question.id, {
                                      required: checked as boolean,
                                    })
                                  }
                                />
                                <Label>आवश्यक | Required</Label>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {activeStepData.questions.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Settings className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>यस चरणमा कुनै प्रश्न छैन</p>
                      <p className="text-sm">
                        माथिको "प्रश्न थप्नुहोस्" बटन थिचेर प्रश्न थप्नुहोस्
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
