/**
 * Task Service - Handles all API operations for tasks
 * Uses the ApperClient from the Apper SDK to interact with the backend
 */

// Initialize ApperClient
const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Constants
const TABLE_NAME = 'task2';

/**
 * Get all tasks with filtering options
 */
export async function fetchTasks(filters = {}) {
  try {
    const apperClient = getApperClient();
    
    // Setup query parameters
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "title" } },
        { Field: { Name: "description" } },
        { Field: { Name: "status" } },
        { Field: { Name: "priority" } },
        { Field: { Name: "dueDate" } },
        { Field: { Name: "CreatedOn" } },
        { Field: { Name: "Owner" } },
        { Field: { Name: "Tags" } }
      ],
      orderBy: [
        {
          field: "dueDate",
          direction: "ASC"
        }
      ],
      where: []
    };
    
    // Add filters if provided
    if (filters.status) {
      params.where.push({
        fieldName: "status",
        Operator: "ExactMatch",
        values: [filters.status]
      });
    }
    
    if (filters.priority) {
      params.where.push({
        fieldName: "priority",
        Operator: "ExactMatch",
        values: [filters.priority]
      });
    }
    
    // Execute the query
    const response = await apperClient.fetchRecords(TABLE_NAME, params);
    
    // Check if there's data
    if (!response || !response.data) {
      return [];
    }
    
    // Format the response to match the app's expected data structure
    return response.data.map(item => ({
      id: item.Id.toString(),
      title: item.title || "",
      description: item.description || "",
      status: item.status || "Not Started",
      priority: item.priority || "Medium",
      dueDate: item.dueDate || new Date().toISOString(),
      createdAt: item.CreatedOn || new Date().toISOString(),
      owner: item.Owner || null,
      tags: item.Tags || []
    }));
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

/**
 * Create a new task
 */
export async function createTask(taskData) {
  try {
    const apperClient = getApperClient();
    
    // Prepare the record
    const params = {
      records: [{
        title: taskData.title,
        description: taskData.description || "",
        status: taskData.status || "Not Started",
        priority: taskData.priority || "Medium",
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0]
      }]
    };
    
    // Create the record
    const response = await apperClient.createRecord(TABLE_NAME, params);
    
    if (response && response.success && response.results && response.results.length > 0) {
      const createdTask = response.results[0].data;
      return {
        id: createdTask.Id.toString(),
        title: createdTask.title,
        description: createdTask.description,
        status: createdTask.status,
        priority: createdTask.priority,
        dueDate: createdTask.dueDate,
        createdAt: createdTask.CreatedOn
      };
    }
    
    throw new Error("Failed to create task");
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
}

/**
 * Update task status
 */
export async function updateTaskStatus(taskId, status) {
  try {
    const apperClient = getApperClient();
    
    const params = {
      records: [{ Id: parseInt(taskId), status }]
    };
    
    return await apperClient.updateRecord(TABLE_NAME, params);
  } catch (error) {
    console.error(`Error updating task status:`, error);
    throw error;
  }
}

/**
 * Delete a task
 */
export async function deleteTask(taskId) {
  try {
    const apperClient = getApperClient();
    
    const params = {
      RecordIds: [parseInt(taskId)]
    };
    
    return await apperClient.deleteRecord(TABLE_NAME, params);
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
}