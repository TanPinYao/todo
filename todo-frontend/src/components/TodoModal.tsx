import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
} from "@mui/material";
import { TodoItemDto } from "../types";
import { createTodo, updateTodo, deleteTodo } from "../api/todoApi";

interface Props {
  open: boolean;
  item?: TodoItemDto | null;
  readonly?: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const TodoModal: React.FC<Props> = ({
  open,
  item,
  readonly = false,
  onClose,
  onSaved,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string[] }>({});
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<"success" | "error" | null>(null);
  const [status, setStatus] = useState<"init" | "processing">("init");

  useEffect(() => {
    if (!open) return;

    if (item) {
      setTitle(item.title);
      setContent(item.content || "");
    } else {
      setTitle("");
      setContent("");
    }

    setErrors({});
    setStatusMessage(null);
    setStatusType(null);
    setStatus("init");
  }, [item, open]);

  const handleSubmit = async () => {
    setErrors({});
    setStatusMessage(null);

    if (!title.trim() || !content.trim()) {
      setStatusMessage("Title and content cannot be empty.");
      setStatusType("error");
      setStatus("init");
      setConfirmSubmitOpen(false);
      return; 
    }

    setStatus("processing");

    const payload = { ...item, title, content };

    try {
      const res = item ? await updateTodo(payload) : await createTodo(payload);
      setStatusMessage(res.data.message ?? "Operation successful.");
      setStatusType("success");
      onSaved();
      setConfirmSubmitOpen(false);
    } catch (err: any) {
      if (err.response?.status === 400 && err.response.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setStatusMessage(err.response?.data?.message ?? "Something went wrong.");
        setStatusType("error");
      }
    } finally {
      setStatus("init");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!item) return;
    setStatus("processing");

    try {
      const res = await deleteTodo(item.todo_id);
      setStatusMessage(res.data.message ?? "Deleted successfully.");
      setStatusType("success");
      onSaved();
      setConfirmDeleteOpen(false);
    } catch (err: any) {
      setStatusMessage(err.response?.data?.message ?? "Failed to delete todo.");
      setStatusType("error");
    } finally {
      setStatus("init");
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {readonly
            ? "📋 Todo Details"
            : item
            ? "✏️ Edit Todo"
            : "🆕 New Todo"}
        </DialogTitle>

        <DialogContent dividers>
          {statusMessage && (
            <Box
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 1,
                bgcolor:
                  statusType === "success" ? "success.light" : "error.light",
                color: "white",
              }}
            >
              <Typography variant="body2">{statusMessage}</Typography>
            </Box>
          )}

          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Title"
              fullWidth
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              error={!!errors.title}
              helperText={errors.title ? errors.title[0] : ""}
              disabled={readonly || status === "processing"}
            />

            <TextField
              label="Content"
              fullWidth
              multiline
              minRows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              error={!!errors.content}
              helperText={errors.content ? errors.content[0] : ""}
              disabled={readonly || status === "processing"}
            />
          </Box>
        </DialogContent>

        <DialogActions>
          <Button
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={status === "processing"}
          >
            Close
          </Button>

          {item && !readonly && (
            <>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setConfirmDeleteOpen(true)}
                disabled={status === "processing"}
              >
                Delete ToDo
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={() => setConfirmSubmitOpen(true)}
                disabled={status === "processing"}
              >
                Update ToDo
              </Button>
            </>
          )}

          {!item && !readonly && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setConfirmSubmitOpen(true)}
              disabled={status === "processing"}
            >
              Create
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Confirm Submit Dialog */}
      <Dialog
        open={confirmSubmitOpen}
        onClose={() => {
          if (status !== "processing") setConfirmSubmitOpen(false);
        }}
      >
        <DialogTitle>
          {item ? "Confirm Update" : "Confirm Create"}
        </DialogTitle>
        <DialogContent>
          <Typography>
            {item
              ? "Are you sure you want to update this ToDo?"
              : "Are you sure you want to create this ToDo?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmSubmitOpen(false)}
            color="inherit"
            disabled={status === "processing"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            color="primary"
            variant="contained"
            disabled={status === "processing"}
            startIcon={status === "processing" ? <CircularProgress size={18} /> : undefined}
          >
            {status === "processing"
              ? item
                ? "Updating..."
                : "Creating..."
              : item
              ? "Yes, Update"
              : "Yes, Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => {
          if (status !== "processing") setConfirmDeleteOpen(false);
        }}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent>
          <Typography>This will permanently delete the ToDo.</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDeleteOpen(false)}
            color="inherit"
            disabled={status === "processing"}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={status === "processing"}
            startIcon={status === "processing" ? <CircularProgress size={18} /> : undefined}
          >
            {status === "processing" ? "Deleting..." : "Yes, Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TodoModal;
