import Job from "../models/jobs";
import {
  deleteJob,
  getJob,
  getJobs,
  newJob,
  updateJob,
} from "./jobsController";

const mockJob = {
  _id: "636ad8d88242262f5d0d85cc",
  title: "Node Developer",
  description:
    "Must be a full-stack developer, able to implement everything in a MEAN or MERN stack paradigm (MongoDB, Express, Angular and/or React, and Node.js).",
  email: "employeer1@gmail.com",
  address: "651 Rr 2, Oquawka, IL, 61469",
  company: "Knack Ltd",
  industry: [],
  positions: 2,
  salary: 155000,
  user: "6368dadd983d6c4b181e37c1",
  postingDate: "2022-11-08T22:31:52.441Z",
};

const mockRequest = () => {
  return {
    body: {},
    query: {},
    params: {},
    user: {},
  };
};

const mockResponse = () => {
  return {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
};

afterEach(() => {
  // restore the spy created with spyOn
  jest.restoreAllMocks();
});

describe("Jobs Controller", () => {
  describe("Get All Jobs", () => {
    it("should get all jobs", async () => {
      jest.spyOn(Job, "find").mockImplementationOnce(() => ({
        limit: () => ({
          skip: jest.fn().mockResolvedValueOnce([mockJob]),
        }),
      }));

      const mockReq = mockRequest();
      const mockRes = mockResponse();

      await getJobs(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        jobs: [mockJob],
      });
    });
  });
  describe("Create new Job", () => {
    it("should create a new job", async () => {
      jest.spyOn(Job, "create").mockResolvedValueOnce(mockJob);

      const mockReq = (mockRequest().body = {
        body: {
          title: "Node Developer",
          description:
            "Must be a full-stack developer, able to implement everything in a MEAN or MERN stack paradigm (MongoDB, Express, Angular and/or React, and Node.js).",
          email: "employeer1@gmail.com",
          address: "651 Rr 2, Oquawka, IL, 61469",
          company: "Knack Ltd",
          positions: 2,
          salary: 155000,
        },
        user: {
          id: "6368dadd983d6c4b181e37c1",
        },
      });

      const mockRes = mockResponse();

      await newJob(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        job: mockJob,
      });
    });

    it("should throw validation error", async () => {
      jest
        .spyOn(Job, "create")
        .mockRejectedValueOnce({ name: "ValidationError" });

      const mockReq = (mockRequest().body = {
        body: {
          title: "Node Developer",
        },
        user: {
          id: "6368dadd983d6c4b181e37c1",
        },
      });

      const mockRes = mockResponse();

      await newJob(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Please enter all values",
      });
    });
  });

  describe("Get Single Job", () => {
    it("should throw job not found error", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(null);

      const mockReq = (mockRequest().params = {
        params: { id: "636ad8d88242262f5d0d85c1" },
      });
      const mockRes = mockResponse();

      await getJob(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Job not found",
      });
    });

    it("should get job by ID", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(mockJob);

      const mockReq = (mockRequest().params = {
        params: { id: "636ad8d88242262f5d0d85cc" },
      });
      const mockRes = mockResponse();

      await getJob(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        job: mockJob,
      });
    });

    it("should throw invalid ID error", async () => {
      jest.spyOn(Job, "findById").mockRejectedValueOnce({ name: "CastError" });

      const mockReq = (mockRequest().params = {
        params: { id: "sdlkfdjlk" },
      });
      const mockRes = mockResponse();

      await getJob(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Please enter correct id",
      });
    });
  });

  describe("Update a Job", () => {
    it("should throw job not found error", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(null);

      const mockReq = (mockRequest().params = {
        params: { id: "636ad8d88242262f5d0d85c1" },
      });
      const mockRes = mockResponse();

      await updateJob(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Job not found",
      });
    });

    it("should throw unauthorized to update this job", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(mockJob);

      const mockReq = (mockRequest().params = {
        params: { id: "636ad8d88242262f5d0d85cc" },
        user: {
          id: "6368dadd983d6c4b181e3711",
        },
      });
      const mockRes = mockResponse();

      await updateJob(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "You are not allowed to update this job",
      });
    });

    it("should update the job by id", async () => {
      const title = "React Developer";
      const updatedJob = { ...mockJob, title };

      jest.spyOn(Job, "findById").mockResolvedValueOnce(mockJob);
      jest.spyOn(Job, "findByIdAndUpdate").mockResolvedValueOnce(updatedJob);

      const mockReq = (mockRequest().params = {
        params: { id: "636ad8d88242262f5d0d85cc" },
        user: {
          id: "6368dadd983d6c4b181e37c1",
        },
        body: { title },
      });
      const mockRes = mockResponse();

      await updateJob(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        job: updatedJob,
      });
    });
  });

  describe("Delete a Job", () => {
    it("should throw job not found error", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(null);

      const mockReq = (mockRequest().params = {
        params: { id: "636ad8d88242262f5d0d85c1" },
      });
      const mockRes = mockResponse();

      await deleteJob(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        error: "Job not found",
      });
    });

    it("should delete the job by id", async () => {
      jest.spyOn(Job, "findById").mockResolvedValueOnce(mockJob);
      jest.spyOn(Job, "findByIdAndDelete").mockResolvedValueOnce(mockJob);

      const mockReq = (mockRequest().params = {
        params: { id: "636ad8d88242262f5d0d85c1" },
      });
      const mockRes = mockResponse();

      await deleteJob(mockReq, mockRes);
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith({
        job: mockJob,
      });
    });
  });
});
