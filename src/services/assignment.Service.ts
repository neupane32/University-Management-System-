import { AppDataSource } from "../config/database.config";
import { Teacher } from "../entities/teacher/teacher.entity";
import { Assignment } from "../entities/Assignment/assignment.entity";
import { Assignment_File } from "../entities/Assignment/assignmentfile.entity";
import HttpException from "../utils/HttpException.utils";
import path from "path";
import fs from "fs";
import { DotenvConfig } from "../config/env.config";

class AssignmentService {
  constructor(
    private readonly assignmentRepo = AppDataSource.getRepository(Assignment),
    private readonly teacherRepo = AppDataSource.getRepository(Teacher),
    private readonly assignmentFileRepo = AppDataSource.getRepository(
      Assignment_File
    )
  ) {}

  async addAssignment(
    data: any,
    TeacherAssignmentFile: any[],
    teacher_id: string
  ) {
    console.log("🚀 ~ AssignmentService ~ data:", data);

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
    if(TeacherAssignmentFile)
{

    for(const file of TeacherAssignmentFile ){
    console.log("🚀 ~ AssignmentService ~ file:", file)
 const baseUrl = DotenvConfig.BASE_URL

      const TeacherAssignmentFile = file
      ?`${baseUrl}/${file.path}`
      : null;
      console.log("🚀 ~ AssignmentService ~ TeacherAssignmentFile:", TeacherAssignmentFile)
        const assignmentFile = this.assignmentFileRepo.create({
             filePath: TeacherAssignmentFile,
             assignment: addAssignment,
             fileName:file.filename
           });
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
    console.log("🚀 ~ AssignmentService ~ TeacherAssignmentFile:", TeacherAssignmentFile)
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
        for(const file of TeacherAssignmentFile){
            const baseUrl = DotenvConfig.BASE_URL
            const TeacherAssignmentFile = file
            ?`${baseUrl}/${file.path}`
            : null;
              const newFile = this.assignmentFileRepo.create({
                filePath: TeacherAssignmentFile,
                fileName:file.filename,
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

  async deleteAssignmentFile(teacher_id: string, assignment_id: string, fileId: string) {
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
console.log(__dirname,"dir")
    const filePath = path.join(__dirname, "../../uploads/teacherAssignmentFiles", file.fileName);
    console.log("🚀 ~ AssignmentService ~ deleteAssignmentFile ~ filePath:", filePath)

      fs.unlinkSync(filePath); 
   
    await this.assignmentFileRepo.delete({ id: fileId });

    return { message: "Assignment file deleted successfully" };
} catch (error) {
    console.log("🚀 ~ AssignmentService ~ deleteAssignmentFile ~ error:", error)
    
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
}

export default AssignmentService;
