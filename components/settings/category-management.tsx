"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/layout/card"
import { Button } from "@/components/ui/forms/button"
import { Input } from "@/components/ui/forms/input"
import { Label } from "@/components/ui/forms/label"
import { Badge } from "@/components/ui/display/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/layout/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/forms/select"
// import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/layout/tabs"
import { Plus, Edit, Trash2, Search, Palette } from "lucide-react"
import { useCategoryStore, type Category } from "@/lib/category-store"
import { iconLibrary, getIconByName, getIconCategories } from "@/lib/icon-library"
import { useToast } from "@/hooks/use-toast"

const colorOptions = [
  { name: 'Blue', value: 'blue', class: 'bg-blue-500' },
  { name: 'Purple', value: 'purple', class: 'bg-purple-500' },
  { name: 'Green', value: 'green', class: 'bg-green-500' },
  { name: 'Orange', value: 'orange', class: 'bg-orange-500' },
  { name: 'Red', value: 'red', class: 'bg-red-500' },
  { name: 'Pink', value: 'pink', class: 'bg-pink-500' },
  { name: 'Indigo', value: 'indigo', class: 'bg-indigo-500' },
  { name: 'Yellow', value: 'yellow', class: 'bg-yellow-500' },
  { name: 'Gray', value: 'gray', class: 'bg-gray-500' },
  { name: 'Teal', value: 'teal', class: 'bg-teal-500' },
]

export function CategoryManagement() {
  const { toast } = useToast()
  const { categories, addCategory, updateCategory, deleteCategory, initializeDefaultCategories } = useCategoryStore()
  const [showDialog, setShowDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIconCategory, setSelectedIconCategory] = useState('Development')
  const [formData, setFormData] = useState({
    name: '',
    icon: 'Code',
    color: 'blue'
  })

  // Initialize default categories for new users
  useEffect(() => {
    initializeDefaultCategories()
  }, [initializeDefaultCategories])

  const iconCategories = getIconCategories()
  const filteredIcons = iconLibrary.filter(icon => {
    const matchesCategory = icon.category === selectedIconCategory
    const matchesSearch = searchQuery === '' || 
      icon.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const resetForm = () => {
    setFormData({ name: '', icon: 'Code', color: 'blue' })
    setEditingCategory(null)
    setSearchQuery('')
    setSelectedIconCategory('Development')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter a category name.",
        variant: "destructive",
      })
      return
    }

    // Check for duplicate names (excluding current category when editing)
    const isDuplicate = categories.some(cat => 
      cat.name.toLowerCase() === formData.name.toLowerCase() && 
      cat.id !== editingCategory?.id
    )

    if (isDuplicate) {
      toast({
        title: "Duplicate Category",
        description: "A category with this name already exists.",
        variant: "destructive",
      })
      return
    }

    try {
      if (editingCategory) {
        updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          icon: formData.icon,
          color: formData.color
        })
        toast({
          title: "✅ Category updated!",
          description: `"${formData.name}" has been updated.`,
        })
      } else {
        addCategory({
          name: formData.name.trim(),
          icon: formData.icon,
          color: formData.color
        })
        toast({
          title: "✅ Category created!",
          description: `"${formData.name}" has been added to your categories.`,
        })
      }

      resetForm()
      setShowDialog(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (category: Category) => {
    setEditingCategory(category)
    setFormData({
      name: category.name,
      icon: category.icon,
      color: category.color
    })
    setShowDialog(true)
  }

  const handleDelete = (category: Category) => {
    if (categories.length <= 1) {
      toast({
        title: "Cannot Delete",
        description: "You must have at least one category.",
        variant: "destructive",
      })
      return
    }

    deleteCategory(category.id)
    toast({
      title: "Category deleted",
      description: `"${category.name}" has been removed.`,
    })
  }

  const getColorClass = (color: string) => {
    const colorMap: Record<string, string> = {
      blue: 'bg-blue-500',
      purple: 'bg-purple-500',
      green: 'bg-green-500',
      orange: 'bg-orange-500',
      red: 'bg-red-500',
      pink: 'bg-pink-500',
      indigo: 'bg-indigo-500',
      yellow: 'bg-yellow-500',
      gray: 'bg-gray-500',
      teal: 'bg-teal-500',
    }
    return colorMap[color] || 'bg-gray-500'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Task Categories
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage your custom task categories with icons and colors
            </p>
          </div>
          <Button onClick={() => setShowDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Category
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <Palette className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Categories Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create your first category to organize your tasks
            </p>
            <Button onClick={() => setShowDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Category
            </Button>
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto">
            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => {
              const IconComponent = getIconByName(category.icon)
              return (
                <div
                  key={category.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getColorClass(category.color)}`}>
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">{category.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {category.icon} • {category.color}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(category)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(category)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )
              })}
            </div>
          </div>
        )}
      </CardContent>

      {/* Add/Edit Category Dialog */}
      <Dialog open={showDialog} onOpenChange={(open) => {
        if (!open) resetForm()
        setShowDialog(open)
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory ? 'Edit Category' : 'Create New Category'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Category Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Category Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Frontend Development, UI Design..."
                required
              />
            </div>

            {/* Color Selection */}
            <div className="space-y-2">
              <Label>Color Theme</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg border transition-all
                      ${formData.color === color.value 
                        ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                        : 'border-border hover:bg-muted'
                      }
                    `}
                  >
                    <div className={`w-4 h-4 rounded-full ${color.class}`} />
                    <span className="text-sm">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-4">
              <Label>Choose Icon</Label>
              
              {/* Icon Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search icons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Icon Categories */}
              <Tabs value={selectedIconCategory} onValueChange={setSelectedIconCategory}>
                <TabsList className="grid w-full grid-cols-4 lg:grid-cols-6">
                  {iconCategories.slice(0, 6).map((category) => (
                    <TabsTrigger key={category} value={category} className="text-xs">
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                <TabsContent value={selectedIconCategory} className="mt-4">
                  <div className="h-48 w-full border rounded-lg p-4 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-2">
                      {filteredIcons.map((iconOption) => {
                        const IconComponent = iconOption.icon
                        const isSelected = formData.icon === iconOption.name
                        return (
                          <button
                            key={iconOption.name}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, icon: iconOption.name }))}
                            className={`
                              p-3 rounded-lg border transition-all hover:bg-muted
                              ${isSelected 
                                ? 'border-primary bg-primary/10 ring-2 ring-primary/20' 
                                : 'border-border'
                              }
                            `}
                            title={iconOption.name}
                          >
                            <IconComponent className="w-5 h-5 mx-auto" />
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {/* Selected Icon Preview */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                <div className={`p-2 rounded-lg ${getColorClass(formData.color)}`}>
                  {(() => {
                    const IconComponent = getIconByName(formData.icon)
                    return <IconComponent className="w-5 h-5 text-white" />
                  })()}
                </div>
                <div>
                  <p className="font-medium">{formData.name || 'Category Name'}</p>
                  <p className="text-sm text-muted-foreground">
                    {formData.icon} • {formData.color}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDialog(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </Card>
  )
}