import { AppDataSource } from "../config/database.config";
import { Teacher } from "../entities/teacher/teacher.entity";
import { Assignment } from "../entities/Assignment/assignment.entity";
import { Assignment_File } from "../entities/Assignment/assignmentfile.entity";
import HttpException from "../utils/HttpException.utils";
import path from "path";
import fs from "fs";
import { DotenvConfig } from "../config/env.config";
import { Student } from "../entities/student/student.entity";
import { submitAssignmnet } from "../entities/Assignment/submitAssignment.entity";
import { Student_Assignment } from "../entities/Assignment/student_assignment.entity";
import { Submission_File } from "../entities/Assignment/submission_file.entity";
import { AssignmentStatus } from "../constant/enum";

class AssignmentService {
  constructor(
    private readonly assignmentRepo = AppDataSource.getRepository(Assignment),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly assignmentFileRepo = AppDataSource.getRepository(
      Assignment_File
    ),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly submitAssignmentRepo = AppDataSource.getRepository(
      submitAssignmnet
    ),
    private readonly studentAssignmentRepo = AppDataSource.getRepository(
      Student_Assignment
    ),
    private readonly submissionFileRepo = AppDataSource.getRepository(
      Submission_File
    )
  ) {}

  async addAssignment(
    data: any,
    TeacherAssignmentFile: any[],
    teacher_id: string
  ) {
    console.log("🚀 ~ AssignmentService ~ data:", data)
  

    const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
    if (!teacher) throw new Error("Teacher Not found");

    const addAssignment = this.assignmentRepo.create({
      title: data.title,
      description: data.description,
      due_date: data.due_date,
      module: { id: data.module },
      teacher: { id: teacher_id },
    });
    await this.assignmentRepo.save(addAssignment);
    if (TeacherAssignmentFile) {
      for (const file of TeacherAssignmentFile) {
        console.log("🚀 ~ AssignmentService ~ file:", file);
        const baseUrl = DotenvConfig.BASE_URL;

        const TeacherAssignmentFile = file ? `${baseUrl}/${file.path}` : null;
        console.log(
          "🚀 ~ AssignmentService ~ TeacherAssignmentFile:",
          TeacherAssignmentFile
        );
        const assignmentFile = this.assignmentFileRepo.create({
          filePath: TeacherAssignmentFile,
          assignment: addAssignment,
          fileName: file.filename,
        });
        console.log("🚀 ~ AssignmentService ~ assignmentFile:", assignmentFile)
        await this.assignmentFileRepo.save(assignmentFile);
      }
    }
    return addAssignment;
  }

  async getAssignment(teacher_id: string) {
    const getAssignment = this.assignmentRepo.find({
      where: {
        teacher: { id: teacher_id },
      },
      relations: ["teacher", "module", "files"],
    });
    if (!getAssignment) throw new Error("Assignment not found");
    return getAssignment;
  }

  async updateAssignment(
    teacher_id: string,
    id: string,
    TeacherAssignmentFile: any[],
    data: any
  ) {
    console.log(
      "🚀 ~ AssignmentService ~ TeacherAssignmentFile:",
      TeacherAssignmentFile
    );
    try {
      const assignment = await this.assignmentRepo.findOne({
        where: { id },
        relations: ["teacher"],
      });
      if (!assignment) throw new Error("Assignnment not found");

      const update = await this.assignmentRepo.update(
        { id },
        {
          title: data.title,
          description: data.description,
          due_date: data.due_date,
          module: { id: data.module },
          teacher: { id: teacher_id },
        }
      );

      if (TeacherAssignmentFile) {
        for (const file of TeacherAssignmentFile) {
          const baseUrl = DotenvConfig.BASE_URL;
          const TeacherAssignmentFile = file ? `${baseUrl}/${file.path}` : null;
          const newFile = this.assignmentFileRepo.create({
            filePath: TeacherAssignmentFile,
            fileName: file.filename,
            assignment: assignment,
          });
          await this.assignmentFileRepo.save(newFile);
        }
      }
      return update;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Failed to update assignment");
      }
    }
  }

  async deleteAssignmentFile(
    teacher_id: string,
    assignment_id: string,
    fileId: string
  ) {
    try {
      const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw new Error("Teacher Not Found");

      const assignment = await this.assignmentRepo.findOneBy({
        id: assignment_id,
      });
      if (!assignment) throw new Error("Assignment not found");

      const file = await this.assignmentFileRepo.findOne({
        where: { id: fileId },
      });

      if (!file) {
        throw new Error("Assignment file not found");
      }
      console.log(__dirname, "dir");
      const filePath = path.join(
        __dirname,
        "../../uploads/teacherAssignmentFiles",
        file.fileName
      );
      console.log(
        "🚀 ~ AssignmentService ~ deleteAssignmentFile ~ filePath:",
        filePath
      );

      fs.unlinkSync(filePath);

      await this.assignmentFileRepo.delete({ id: fileId });

      return { message: "Assignment file deleted successfully" };
    } catch (error) {
      console.log(
        "🚀 ~ AssignmentService ~ deleteAssignmentFile ~ error:",
        error
      );
    }
  }

  async deleteAssignment(teacher_id: string, assignment_id) {
    const teacher = await this.teacherRepo.findOneBy({ id: teacher_id });
    if (!teacher) throw new Error("Teacher Not Found");

    const assignment = await this.assignmentRepo.findOneBy({
      id: assignment_id,
    });
    if (!assignment) throw new Error("Assignment not found");

    await this.assignmentRepo.delete({ id: assignment_id });
    return "Assignment deleted successfully";
  }

  async submitAssignment(
    student_id: string,
    assignment_id: string,
    assignment_file: any[],
    data: any
  ) {
    try {
      const student = await this.studentRepo.findOneBy({ id: student_id });
      if (!student) throw new Error("Student Not Found");

      const assignment = await this.assignmentRepo.findOneBy({
        id: assignment_id,
      });
      if (!assignment) throw new Error("Assignment not found");
      const submissionDate = new Date(data.dateTime);
      console.log("🚀 ~ AssignmentService ~ submissionDate:", submissionDate)
      const dueDate = new Date(assignment.due_date);
      console.log("🚀 ~ AssignmentService ~ dueDate:", dueDate)
      
      if (submissionDate > dueDate) {
          await this.assignmentRepo.update({id:assignment_id},{status:AssignmentStatus.CLOSED})
        throw new Error("Cannot submit assignment after the due date");
      }
      const submitAssignments = await this.submitAssignmentRepo.create({
        submission_desc: data.submission_desc,
        assignment: assignment,
      });

      await this.submitAssignmentRepo.save(submitAssignments);

      const studentAssignment = this.studentAssignmentRepo.create({
        student,
        assignment: submitAssignments,
      });

      await this.studentAssignmentRepo.save(studentAssignment);
      if (assignment_file) {
        for (const file of assignment_file) {
          const baseUrl = DotenvConfig.BASE_URL;

          const TeacherAssignmentFile = file ? `${baseUrl}/${file.path}` : null;
          const submission_file = this.submissionFileRepo.create({
            filePath: TeacherAssignmentFile,
            fileName: file.filename,
            submisson: studentAssignment,
          });
          await this.submissionFileRepo.save(submission_file);
        }
        return studentAssignment;
      }
    } catch (error: any) {
      throw new Error(error.message);
      console.log("🚀 ~ AssignmentService ~ submitAssignment ~ error:", error);
    }
  }

  async getAssignmentByStudent(student_id: string, module_id: string) {
    const student = await this.studentRepo.findOneBy({ id: student_id });
    if (!student) throw new Error("student not found");
    
    const assignments = await this.assignmentRepo.find({
      where: {
        module: { id: module_id },
        status: AssignmentStatus.OPEN,
      },
      relations: [
        "teacher",
        "module",
        "files",
        "submissions",
        "submissions.submissions",
        "submissions.submissions.student",
      ],
    });
    if (!assignments) throw new Error("Assignment not found");
  
    const processedAssignments = assignments.map(assignment => {
      let submitted = false;
      if (assignment.submissions) {
        // Loop over each submitAssignmnet.
        assignment.submissions.forEach((submission) => {
          if (submission.submissions) {
           // @ts-ignore
            submission.submissions.forEach(studentSubmission => {
              if (studentSubmission.student && studentSubmission.student.id === student_id) {
                submitted = true;
              }
            });
          }
        });
      }
      return { ...assignment, isSubmitted: submitted };
    });
  
    return processedAssignments;
  }
  

  async updateAssignmentByStudent(
    student_id: string,
    SubmitAssignment_id: string,
    studentAssignmentFiles: any[],
    data: any
  ) {
    console.log("🚀 ~ AssignmentService ~ student_id:", student_id)
    console.log("🚀 ~ AssignmentService ~ SubmitAssignment_id:", SubmitAssignment_id)
    try {
      const student = await this.studentRepo.findOneBy({ id: student_id });
      if (!student) throw new Error("Student Not Found");

      const assignment = await this.submitAssignmentRepo.findOne({where:{ id: SubmitAssignment_id}, relations:["assignment"]});
      if (!assignment) throw new Error("Assignment for submit not found");
      console.log("🚀 ~ AssignmentService ~ assignment:", assignment)
const assignment_id = assignment.assignment
      console.log("🚀 ~ AssignmentService ~ assignment_id:", assignment_id)
      const findAssignment = await this.assignmentRepo.findOneBy({id:assignment.assignment.id})
      if(!findAssignment) throw new Error("Assignment not found")
      console.log("🚀 ~ AssignmentService ~ findAssignment:", findAssignment)
      const submissionDate = new Date(data.dateTime);
      const dueDate = new Date(findAssignment.due_date);
      
      if (submissionDate > dueDate) {
          await this.assignmentRepo.update({id:findAssignment.id},{status:AssignmentStatus.CLOSED})
        throw new Error("Cannot submit assignment after the due date");
      }
      const studentAssignment = await this.studentAssignmentRepo.findOne({
        where: {
          student: { id: student_id },
          assignment: { id: SubmitAssignment_id },
        },
        relations: ["assignment"],
      });

      if (!studentAssignment) {
        throw new Error("Assignment submission not found for update");
      }

      studentAssignment.assignment.submission_desc = data.submission_desc;
      await this.submitAssignmentRepo.save(studentAssignment.assignment);

      const existingFiles = await this.submissionFileRepo.find({
        where: { submisson: { id: studentAssignment.id } },
      });

      if (studentAssignmentFiles) {
        for (const file of studentAssignmentFiles) {
          const baseUrl = DotenvConfig.BASE_URL;
          const filePath = file ? `${baseUrl}/${file.path}` : null;
          const submissionFile = this.submissionFileRepo.create({
            filePath,
            fileName: file.filename,
            submisson: studentAssignment,
          });
          await this.submissionFileRepo.save(submissionFile);
        }
      }
      return studentAssignment;
    } catch (error: any) {
      console.error(
        "🚀 ~ AssignmentService ~ updateAssignmentByStudent ~ error:",
        error
      );
      throw new Error(error.message);
    }
  }

  async deleteAssignmentFileByStudent(
    student_id: string,
    submissionAssignment_id: string,
    fileId: string
  ) {
    console.log("🚀 ~ AssignmentService ~ submissionAssignment_id:", submissionAssignment_id)
    try {
        const student = await this.studentRepo.findOneBy({ id: student_id });
        if (!student) throw new Error("Student Not Found");
  
        const assignment = await this.submitAssignmentRepo.findOneBy({ id: submissionAssignment_id});
        if (!assignment) throw new Error("Assignment for submit not found");

      const file = await this.submissionFileRepo.findOne({
        where: { id: fileId },
      });

      if (!file) {
        throw new Error("Assignment file not found");
      }
      console.log(__dirname, "dir");
      const filePath = path.join(
        __dirname,
        "../../uploads/studentAssignmentFiles",
        file.fileName
      );

      fs.unlinkSync(filePath);

      await this.submissionFileRepo.delete({ id: fileId });

      return " Submitted Assignment file deleted successfully" 
    } catch (error) {
    console.log("🚀 ~ AssignmentService ~ error:", error)
    }
  }
}

export default AssignmentService;
