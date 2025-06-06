import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useWeather } from "@/contexts/WeatherContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WidgetConfig } from "@/types/weather";
import { X } from "lucide-react";

function ConfirmDeleteModal({ widget }: { widget: WidgetConfig }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { removeWidget } = useWeather();

  const toggleDialog = () => {
    setIsDialogOpen((state) => !state);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={toggleDialog}>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" aria-label="Delete widget">
          <X className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col sm:max-w-md w-full h-full sm:h-auto sm:rounded-lg">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this widget?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-between gap-3 md:gap-0">
          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              removeWidget(widget.id);
              setIsDialogOpen(false);
            }}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ConfirmDeleteModal;
