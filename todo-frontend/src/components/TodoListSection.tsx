import React from "react";
import { TodoItemDto } from "../types";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ModeEditIcon from "@mui/icons-material/ModeEdit";

interface Props {
  items: TodoItemDto[];
  onEdit?: (item: TodoItemDto) => void;
  initiallyCollapsed?: boolean;
}

const TodoListSection: React.FC<Props> = ({
  items,
  onEdit,
  initiallyCollapsed = false,
}) => {
  const [expanded, setExpanded] = React.useState(!initiallyCollapsed);

  return (
    <Accordion
      expanded={expanded}
      onChange={() => setExpanded(!expanded)}
      sx={{
        mb: 2,
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <AccordionSummary
        expandIcon={<KeyboardArrowDownIcon />}
      >
        <Typography>To Do List</Typography>
      </AccordionSummary>

      <AccordionDetails>
        {items.length > 0 ? (
          <List sx={{ p: 0 }}>
            {items.map((item, index) => (
              <ListItem
                key={item.todo_id}
                sx={{
                  border: "1px solid #e0e0e0",
                  borderRadius: 2,
                  mb: 1,
                }}
                secondaryAction={
                  onEdit && (
                    <IconButton onClick={() => onEdit(item)}>
                      <ModeEditIcon />
                    </IconButton>
                  )
                }
              >
                <ListItemText
                  primary={
                    <Typography fontWeight={600}>
                      {index + 1}. {item.title}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">
            No To Do items
          </Typography>
        )}
      </AccordionDetails>
    </Accordion>
  );
};

export default TodoListSection;
