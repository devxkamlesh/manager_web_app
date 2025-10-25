"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/layout/dialog"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Textarea } from "@/components/ui/forms/textarea"
import { Label } from "@/components/ui/forms/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Flame, 
  Code, 
  BookOpen, 
  Dumbbell, 
  Brain, 
  Target,
  Save,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface CreateStreakDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onStreakCreated: () => void
}

const streakTypes = [
  { id: 'coding', label: 'Coding', icon: Code, color: 'bg-blue-500', description: 'Programming and development' },
  { id: 'learning', label: 'Learning', icon: BookOpen, color: 'bg-green-500', description: 'Study and skill development' },
  { id: 'fitness', label: 'Fitness', icon: Dumbbell, color: 'bg-red-500', description: 'Exercise and physical activity' },
  { id: 'reading', label: 'Reading', icon: BookOpen, color: 'bg-purple-500', description: 'Books and articles' },
  { id: 'meditation', label: 'Meditation', icon: Brain, color: 'bg-indigo-500', description: 'Mindfulness and mental health' },
  { id: 'custom', label: 'Custom', icon: Target, color: 'bg-gray-500', description: 'Your own habit' }
]

export function CreateStreakDialog({ open, onOpenChange, onStreakCreated }: CreateStreakDialogProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'coding' as 'coding' | 'learning' | 'fitness' | 'reading' | 'meditation' | 'custom',
    target_days: 30
  })

  const createStreak = async () => {
    if (!formData.name.trim() || isSubmitting) return

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      
      toast({ 
        title: "🔥 Streak created!", 
        description: `"${formData.name}" streak is ready to go!` 
      })
      
      onStreakCreated()
      onOpenChange(false)
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        type: 'coding',
        target_days: 30
      })
    } catch (error) {
      console.error('Streak creation error:', error)
      toast({ 
        title: "Failed to create streak", 
        description: "Please try again.", 
        variant: "destructive" 
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Flame className="w-6 h-6 text-orange-500" />
            Create New Streak
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Streak Name *</Label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Daily Coding, Morning Workout..."
                className="mt-1"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe your habit and goals..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="text-sm font-medium">Streak Type</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData(prev => ({ ...prev, type: value }))}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select streak type" />
                </SelectTrigger>
                <SelectContent>
                  {streakTypes.map((type) => {
                    const IconComponent = type.icon
                    return (
                      <SelectItem key={type.id} value={type.id}>
                        <div className="flex items-center gap-3">
                          <div className={cn("p-1 rounded", type.color)}>
                            <IconComponent className="w-3 h-3 text-white" />
                          </div>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-sm font-medium">Target Days</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={formData.target_days}
                onChange={(e) => setFormData(prev => ({ ...prev, target_days: parseInt(e.target.value) || 30 }))}
                placeholder="30"
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                How many consecutive days do you want to maintain this habit?
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={createStreak}
              disabled={isSubmitting || !formData.name.trim()}
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Streak
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}