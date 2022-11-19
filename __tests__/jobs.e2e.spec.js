import request from "supertest";
import app from "../app";
import { connectDatabase, closeDatabase } from "./db-handler";

const newJob = {
  title: "Node Developer",
  description:
    "Must be a full-stack developer, able to implement everything in a MEAN or MERN stack paradigm (MongoDB, Express, Angular and/or React, and Node.js).",
  email: "employeer1@gmail.com",
  address: "651 Rr 2, Oquawka, IL, 61469",
  company: "Knack Ltd",
  positions: 2,
  salary: 155000,
};

let jwtToken = "";
let jobCreated = "";

beforeAll(async () => {
  await connectDatabase();

  const res = await request(app).post("/api/v1/register").send({
    name: "Test User",
    email: "test@gmail.com",
    password: "12345678",
  });

  jwtToken = res.body.token;
});

afterAll(async () => await closeDatabase());

describe("Jobs (e2e)", () => {
  describe("(GET) - Get All Jobs", () => {
    it("should get all jobs", async () => {
      const res = await request(app).get("/api/v1/jobs");

      expect(res.statusCode).toBe(200);
      expect(res.body.jobs).toBeInstanceOf(Array);
    });
  });

  describe("(POST) - Create new Job", () => {
    it("should throw validation error", async () => {
      const res = await request(app)
        .post("/api/v1/job/new")
        .set("Authorization", "Bearer " + jwtToken)
        .send({
          title: "PHP Developer",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Please enter all values");
    });

    it("should create a new job", async () => {
      const res = await request(app)
        .post("/api/v1/job/new")
        .set("Authorization", "Bearer " + jwtToken)
        .send(newJob);

      expect(res.statusCode).toBe(201);
      expect(res.body.job).toMatchObject(newJob);
      expect(res.body.job._id).toBeDefined();

      jobCreated = res.body.job;
    });
  });

  describe("(GET) - Get a job by id", () => {
    it("should get job by id", async () => {
      const res = await request(app).get(`/api/v1/job/${jobCreated._id}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.job).toMatchObject(jobCreated);
    });

    it("should throw job not found error", async () => {
      const res = await request(app).get(
        `/api/v1/job/63791e5c8a33ae2ab2b6f312`
      );

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Job not found");
    });

    it("should throw invalid id error", async () => {
      const res = await request(app).get(`/api/v1/job/ksjdlf`);

      expect(res.statusCode).toBe(400);
      expect(res.body.error).toBe("Please enter correct id");
    });
  });

  describe("(PUT) - Update a Job", () => {
    it("should throw job not found error", async () => {
      const res = await request(app)
        .put(`/api/v1/job/63791e5c8a33ae2ab2b6f312`)
        .set("Authorization", "Bearer " + jwtToken);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Job not found");
    });

    it("should update the job by id", async () => {
      const res = await request(app)
        .put(`/api/v1/job/${jobCreated._id}`)
        .set("Authorization", "Bearer " + jwtToken)
        .send({ title: "Updated name" });

      expect(res.statusCode).toBe(200);
      expect(res.body.job.title).toBe("Updated name");
    });
  });

  describe("(DELETE) - Delete a Job", () => {
    it("should throw job not found error", async () => {
      const res = await request(app)
        .delete(`/api/v1/job/63791e5c8a33ae2ab2b6f312`)
        .set("Authorization", "Bearer " + jwtToken);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Job not found");
    });

    it("should delete the job by id", async () => {
      const res = await request(app)
        .delete(`/api/v1/job/${jobCreated._id}`)
        .set("Authorization", "Bearer " + jwtToken);

      expect(res.statusCode).toBe(200);
      expect(res.body.job._id).toBe(jobCreated._id);
    });
  });
});
