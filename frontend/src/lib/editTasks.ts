export const handleUpdate = async ({
  taskId,
  token,
  title,
  description,
}: {
  taskId: string;
  token: string;
  title: string;
  description: string;
}) => {
  const res = await fetch(`http://localhost:5000/api/v1/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Update failed");

  console.log("Task updated:", data);
};
