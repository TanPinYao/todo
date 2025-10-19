import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  Stack,
  Paper,
} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import TodoModal from "./TodoModal";
import TodoListSection from "./TodoListSection";
import { getTodos } from "../api/todoApi";
import { TodoItemDto } from "../types";

const TodoList: React.FC = () => {
  const [todos, setTodos] = useState<TodoItemDto[]>([]);
  const [editingItem, setEditingItem] = useState<TodoItemDto | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    const data = await getTodos();
    setTodos(data);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Button
          variant="contained"
          onClick={() => setIsModalOpen(true)}
          endIcon={<AddIcon/>}
        >
          Add Todo
        </Button>

        <Typography variant="body1" color="text.secondary">
          📋 Total: {todos.length}
        </Typography>
      </Stack>

      <Box>
        <TodoListSection
          items={todos}
          onEdit={setEditingItem}
        />
      </Box>

      <TodoModal
        key={editingItem?.todo_id ?? ''}
        open={isModalOpen || !!editingItem}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        item={editingItem}
        onSaved={() => {
          loadTodos();
          setIsModalOpen(false);
          setEditingItem(null);
        }}
      />
    </Paper>
  );
};

export default TodoList;
