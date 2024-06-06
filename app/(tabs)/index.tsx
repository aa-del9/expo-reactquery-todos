import {
  ActivityIndicator,
  Button,
  ListRenderItem,
  StyleSheet,
  TextInput,
  FlatList,
} from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { useEffect, useState } from "react";
import { Todo, deleteToDo, getTodos, postToDo, updateToDo } from "@/api/todos";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

export default function TabOneScreen() {
  const [todoText, setTodo] = useState<string>("");
  const queryClient = useQueryClient();
  //get query
  const {
    data: todos,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["todos"],
    queryFn: getTodos,
  });
  //add mutation
  const { mutate: addMutation } = useMutation({
    mutationFn: postToDo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
        exact: true,
      });
    },
  });

  //delete mutation
  const { mutate: deleteMutation } = useMutation({
    mutationFn: deleteToDo,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["todos"],
        exact: true,
      });
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
  //update mutation
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

    return (
      <View style={styles.todo}>
        <View style={{ flexGrow: 1, flexDirection: "row", columnGap: 10 }}>
          <Ionicons
            name={
              item.completed ? "checkmark-circle" : "checkmark-circle-outline"
            }
            size={24}
            color="white"
            onPress={updateDone}
          />
          <Text style={styles.title} key={item.id}>
            {item.title}
          </Text>
        </View>
        <Ionicons
          onPress={deleteTodo}
          style={{ flexGrow: 0 }}
          name="trash"
          size={24}
          color="red"
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          width: "100%",
        }}
      >
        <TextInput
          value={todoText}
          onChangeText={setTodo}
          style={styles.input}
          placeholder="Add todo"
        />
        <Button
          title="Add Todo"
          onPress={() => {
            addMutation({
              id: todos.length + 1,
              title: todoText,
              completed: false,
            });
          }}
        />
      </View>

      {isLoading && <ActivityIndicator size={"large"} />}
      {isError && <Text>Error fetching todos</Text>}
      <FlatList
        data={todos}
        renderItem={renderTodos}
        keyExtractor={(item) => item.id}
        style={{ width: "93%" }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingVertical: 20,
    flex: 1,
    alignItems: "center",
    // backgroundColor: "white",
    rowGap: 10,
  },
  title: {
    fontSize: 20,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  input: {
    paddingHorizontal: 10,
    backgroundColor: "white",
    width: "68%",
    height: "80%",
    borderRadius: 4,
  },
  todo: {
    flexDirection: "row",
    justifyContent: "flex-start",
    columnGap: 10,
    width: "100%",
    paddingVertical: 7,
  },
});
