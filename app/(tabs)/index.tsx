import { useState } from "react";
import { FlatList, ListRenderItem, ActivityIndicator } from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import {
  YStack,
  XStack,
  Input,
  Button,
  Text,
  useTheme,
  getVariableValue,
} from "tamagui";
import { Todo, deleteToDo, getTodos, postToDo, updateToDo } from "@/api/todos";

export default function TabOneScreen() {
  const [todoText, setTodo] = useState<string>("");
  const queryClient = useQueryClient();
  const theme = useTheme();

  // Get query
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });

  // Add mutation
  const { mutate: addMutation } = useMutation({
    mutationFn: postToDo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"], exact: true });
    },
  });

  // Delete mutation
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteToDo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"], exact: true });
    },
  });

  const updateQueryClient = (updatedTodo: Todo) => {
    queryClient.setQueryData(["todos"], (oldData: Todo[] | undefined) => {
      if (!oldData) {
        return [];
      }
      return oldData.map((todo) =>
        todo.id === updatedTodo.id ? updatedTodo : todo
      );
    });
  };

  // Update mutation
  const { mutate: updateMutation } = useMutation({
    mutationFn: updateToDo,
    onSuccess: updateQueryClient,
  });

  const renderTodos: ListRenderItem<Todo> = ({ item }) => {
    const deleteTodo = () => {
      deleteMutation(item.id);
    };
    const updateDone = () => {
      updateMutation({
        ...item,
        completed: !item.completed,
      });
    };

    const textColor = getVariableValue(theme.text);
    const backgroundColor = getVariableValue(theme.background);

    const placeholderColor = getVariableValue(theme.placeholder);
    const inputBackgroundColor = getVariableValue(theme.inputBackground);

    return (
      <XStack
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        paddingVertical={7}
        backgroundColor={backgroundColor}
      >
        <XStack flexGrow={1} flexDirection="row" gap={5}>
          <Ionicons
            name={
              item.completed ? "checkmark-circle" : "checkmark-circle-outline"
            }
            size={24}
            color={textColor}
            onPress={updateDone}
          />
          <Text key={item.id} fontSize={20} color={textColor}>
            {item.title}
          </Text>
        </XStack>
        <Ionicons onPress={deleteTodo} name="trash" size={24} color="red" />
      </XStack>
    );
  };

  const textColor = getVariableValue(theme.text);
  const backgroundColor = getVariableValue(theme.background);
  const placeholderColor = getVariableValue(theme.placeholder);
  const inputBackgroundColor = getVariableValue(theme.inputBackground);

  return (
    <YStack
      backgroundColor={backgroundColor}
      height={"100%"}
      paddingVertical={20}
    >
      <YStack alignItems="center" width="100%" rowGap={20}>
        <Input
          fontWeight={300}
          value={todoText}
          onChangeText={setTodo}
          placeholder="Type todo"
          placeholderTextColor={placeholderColor}
          width="90%"
          borderRadius={4}
          paddingHorizontal={10}
          backgroundColor={inputBackgroundColor}
        />
        <Button
          fontWeight="bold"
          themeInverse
          onPress={() => {
            addMutation({
              id: todos.length + 1,
              title: todoText,
              completed: false,
            });
          }}
        >
          Add Todo
        </Button>
      </YStack>
      <YStack space width="100%" paddingVertical={20} alignItems="center">
        {isLoading && <ActivityIndicator size={"large"} />}
        {isError && <Text color={textColor}>Error fetching todos</Text>}
        <FlatList
          data={todos}
          renderItem={renderTodos}
          keyExtractor={(item) => item.id.toString()}
          style={{ width: "93%" }}
        />
      </YStack>
    </YStack>
  );
}
