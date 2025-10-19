import { Container, Typography, Box, Paper } from "@mui/material";
import TodoList from "./components/TodoList";

function App() {
  return (
    <Container maxWidth="md">
      <Paper
        sx={{
          padding: 1,
          margin: 1,
          borderRadius: 3,
        }}
      >
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            📝 To Do List
          </Typography>
        </Box>

        <TodoList />
      </Paper>
    </Container>
  );
}

export default App;
