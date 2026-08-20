const mockDatabase = [
  { id: "REQ-1001", owner: "demo-user-1", status: "in_progress" },
  { id: "REQ-1002", owner: "demo-user-1", status: "completed" },
  { id: "REQ-2001", owner: "demo-user-2", status: "pending" },
];

export function registerStatusHandler(agent) {
  agent.registerHandler("check_status", async (query, userId) => {
    const { referenceId } = query;

    if (!referenceId) {
      return { message: "Please provide a referenceId to check." };
    }

    const record = mockDatabase.find(
      (r) => r.id === referenceId && r.owner === userId
    );

    if (!record) {
      return { message: `No record found for "${referenceId}".` };
    }

    return { message: `Status of ${record.id}: ${record.status}` };
  });

  agent.registerHandler("list_my_items", async (_query, userId) => {
    const items = mockDatabase.filter((r) => r.owner === userId);
    return {
      message: `You have ${items.length} item(s).`,
      items: items.map((r) => ({ id: r.id, status: r.status })),
    };
  });
}