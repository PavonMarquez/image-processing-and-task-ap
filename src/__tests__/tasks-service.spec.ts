import { Types } from "mongoose";
import { TaskService } from "../services/tasks-service";
import utilsFunctions from "../utils/utils_functions";
import SharpUtils from "../utils/sharp-utils";
import { taskRepositoryMongo as taskRepo } from "../infrastructure/mongo/task-repository-mongo";

describe("TaskService.createTask - URL case", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a task from a URL and return taskId, price, and status", async () => {
    const fakeUrl = "https://example.com/image.jpg";

    jest.spyOn(utilsFunctions, "downloadImage").mockResolvedValue({
      pathImage: "src/path/to/image.jpg",
      fileName: "image123.jpg",
      metadata: {
        width: 1024,
        height: 800,
        format: "jpeg",
        autoOrient: { width: 1024, height: 800 }
      }
    });

    jest.spyOn(TaskService, "saveImage").mockResolvedValue(new Types.ObjectId("637f1a9c2f1e2c3d4e5f6789"));

    jest.spyOn(TaskService, "saveTask").mockResolvedValue({
      taskId: "637f1a9c2f1e2c3d4e5f6789",
      price: 20.5,
      status: "pending"
    });

    jest.spyOn(TaskService, "processTask").mockImplementation(() => Promise.resolve());

    const result = await TaskService.createTask(fakeUrl, "URL");

    expect(result).toEqual({
      taskId: "637f1a9c2f1e2c3d4e5f6789",
      price: 20.5,
      status: "pending"
    });

    expect(utilsFunctions.downloadImage).toHaveBeenCalledWith(fakeUrl);
    expect(TaskService.saveImage).toHaveBeenCalled();
    expect(TaskService.saveTask).toHaveBeenCalled();
  });
});

describe("TaskService.createTask - Local Path case", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a task from a local path and return taskId, price, and status", async () => {
    const fakePath = "src/public/images/test/image.jpg";

    jest.spyOn(SharpUtils, "getMetadataImage").mockResolvedValue({
      width: 800,
      height: 600,
      format: "jpeg",
      autoOrient: { width: 800, height: 600 }
    });

    jest.spyOn(TaskService, "saveImage").mockResolvedValue(new Types.ObjectId("637f1a9c2f1e2c3d4e5f6789"));

    jest.spyOn(TaskService, "saveTask").mockResolvedValue({
      taskId: "637f1a9c2f1e2c3d4e5f6789",
      price: 25.0,
      status: "pending"
    });

    jest.spyOn(TaskService, "processTask").mockImplementation(() => Promise.resolve());

    const result = await TaskService.createTask(fakePath, "PathLocal");

    expect(result).toEqual({
      taskId: "637f1a9c2f1e2c3d4e5f6789",
      price: 25.0,
      status: "pending"
    });

    expect(utilsFunctions.downloadImage).not.toHaveBeenCalled();
    expect(SharpUtils.getMetadataImage).toHaveBeenCalledWith(fakePath);
    expect(TaskService.saveImage).toHaveBeenCalled();
    expect(TaskService.saveTask).toHaveBeenCalled();
  });
});

describe("TaskService.getTaskById", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return task and image data with resizedVariants", async () => {
    const fakeTaskId = "637f1a9c2f1e2c3d4e5f6789";

    jest.spyOn(taskRepo, "getTaskWithImage").mockResolvedValue({
      taskId: fakeTaskId,
      price: 22.5,
      status: "completed",
      images: {
        resizedVariants: [
          { resolution: "1024", path: "src/public/images/example_1024.jpg" },
          { resolution: "800", path: "src/public/images/example_800.jpg" }
        ]
      }
    });

    const result = await TaskService.getTaskById(fakeTaskId);

    expect(result).toEqual({
      taskId: fakeTaskId,
      price: 22.5,
      status: "completed",
      images: {
        resizedVariants: [
          { resolution: "1024", path: "src/public/images/example_1024.jpg" },
          { resolution: "800", path: "src/public/images/example_800.jpg" }
        ]
      }
    });

    expect(taskRepo.getTaskWithImage).toHaveBeenCalledWith(fakeTaskId);
  });
});