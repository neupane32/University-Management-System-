import { AppDataSource } from "../config/database.config";
import { UniversityInterface } from "../interface/university.interface";
import { University } from "../entities/university/university.entity";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { ProgramInterface } from "../interface/program.interface";
import { Program } from "../entities/Programs/program.entity";
import { ModuleInterface } from "../interface/module.interface";
import { Module } from "../entities/module/module.entity";
import { TeacherInterface } from "../interface/teacher.interface";
import { Teacher } from "../entities/teacher/teacher.entity";
import { ResourceInterface } from "../interface/resource.interface";
import { Resource } from "../entities/resources/resource.entity";
import { StudentInterface } from "../interface/student.interface";
import { Student } from "../entities/student/student.entity";
import { StudentDetails } from "../entities/student/studentDetails.entity";
import { Gender, RoutineStatus } from "../constant/enum";
import { truncate } from "fs";
import { ExamRoutine } from "../entities/examRoutine/examRoutine.entity";
import { Announcement } from "../entities/announcement/announcement.entity";
import { AnnouncementInterface } from "../interface/announcement.interface";

const bcryptservice = new BcryptService();

class UniversityService {
  constructor(
    private readonly uniRepo = AppDataSource.getRepository(University),
    private readonly progRepo = AppDataSource.getRepository(Program),
    private readonly modRepo = AppDataSource.getRepository(Module),
    private readonly TeachRepo = AppDataSource.getRepository(Teacher),
    private readonly resourceRepo = AppDataSource.getRepository(Resource),
    private readonly studentRepo = AppDataSource.getRepository(Student),
    private readonly studentDetailsRepo = AppDataSource.getRepository(
      StudentDetails
    ),
    private readonly routineRepo = AppDataSource.getRepository(ExamRoutine),
    private readonly AnnouncementRepo = AppDataSource.getRepository(
      Announcement
    )
  ) {}

  async createUniversity(data: UniversityInterface) {
    try {
      const emailExist = await this.uniRepo.findOneBy({
        email: data.email,
      });

      if (emailExist) throw new Error("The email is already exists");
      if (data.password !== data.confirm_password)
        throw new Error("Please enter the same password");
      const hashPassword = await bcryptservice.hash(data.password);
      const auth = this.uniRepo.create({
        email: data.email,
        universityName: data.university_name,
        password: hashPassword,
      });
      await this.uniRepo.save(auth);
      return auth;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unknown error occurred");
      }
    }
  }

  async loginUniversity(data: UniversityInterface) {
    try {
      const universityLogin = await this.uniRepo.findOne({
        where: [{ email: data.email }],
        select: ["id", "email", "password", "role"],
      });
      // if(!user?.Verified) throw HttpException.unauthorized("Otp is not verified yet")
      if (!universityLogin)
        throw HttpException.badRequest("Entered email is not registered yet");
      const isPassword = await bcryptservice.compare(
        data.password,
        universityLogin.password
      );
      if (!isPassword) throw HttpException.badRequest("Incorrect password");
      return universityLogin;
    } catch (error: any) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async uniProfile(uni_id: string, data: UniversityInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const uniProfile = await this.uniRepo.findOne({
        where: [{ email: data.email }],
      });
      return uniProfile;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async addProgram(uni_id: string, data: ProgramInterface) {
    try {
      const uniId = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uniId) throw new Error("University Not found");

      const addProgram = this.progRepo.create({
        name: data.name,
        duration: data.duration,
        university: uniId,
      });
      await this.progRepo.save(addProgram);
      return "Program created successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async updateProgam(
    uni_id: string,
    program_id: string,
    data: ProgramInterface
  ) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");
      console.log("🚀 ~ UniversityService ~ updateProgam ~ uni:", uni);

      const program = await this.progRepo.findOneBy({
        id: program_id,
        university: { id: uni_id },
      });
      if (!program) throw new Error("Program Not found");

      const updateProgram = await this.progRepo.update(
        {
          id: program_id,
        },
        {
          name: data.name,
          duration: data.duration,
        }
      );
      return updateProgram;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async findProgram(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const program = await this.progRepo.findBy({
        university: { id: uni_id },
      });

      if (!program) throw new Error("Program not found");
      return program;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid credentials");
      }
    }
  }

  async deleteProgram(uni_id: string, program_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("Uni not found");

      const program = await this.progRepo.findOneBy({ id: program_id });
      if (!program) throw new Error("No Program found");

      await this.progRepo.delete({ id: program.id });

      return "Program deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Program not found");
      }
    }
  }

  async addModule(uni_id: string, prog_id: string, data: ModuleInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.progRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program not found");

      const addModule = this.modRepo.create({
        name: data.name,
        module_code: data.module_code,
        university: uni,
        program: program,
      });

      await this.modRepo.save(addModule);
      return addModule;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Course not found");
      }
    }
  }

  async updateModule(uni_id: string, module_id: string, data: ModuleInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const module = await this.modRepo.findOneBy({ id: module_id });
      if (!module) throw new Error("Module not found");

      await this.modRepo.update(module_id, {
        name: data.name,
        module_code: data.module_code,
      });
      return "Module updated successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Module not found");
      }
    }
  }

  async findModules(uni_id: string, prog_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const program = await this.progRepo.findOneBy({ id: prog_id });
      if (!program) throw new Error("Program not found");

      const modules = await this.modRepo.find({
        where: { id: prog_id },
        relations: ["program"],
      });
      if (!module) throw new Error("Module Not found");

      return modules;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("An unexpected error occurred while fetching modules");
      }
    }
  }

  async deleteModule(uni_id: string, module_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const module = await this.modRepo.findOneBy({ id: module_id });
      if (!module) throw new Error("Module not found");

      await this.modRepo.delete(module_id);
      return "Module deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Module not found");
      }
    }
  }

  async addTeacher(uni_id: string, module_id: string, data: TeacherInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const module = await this.modRepo.findOne({
        where: { id: module_id },
        relations: ["program"],
      });
      if (!module) throw new Error("Module Not found");

      const program = await this.progRepo.findOne({
        where: { id: module.program.id },
      });
      if (!program) throw new Error("Program Not found");

      const hashPassword = await bcryptservice.hash(data.password);

      const teacher = this.TeachRepo.create({
        name: data.name,
        email: data.email,
        password: hashPassword,
        gender: data.gender,
        contact: data.contact,
        university: uni,
        module: module,
        program: module.program,
      });
      await this.TeachRepo.save(teacher);
      return teacher;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Teacher not found");
      }
    }
  }

  async updateTeacher(
    uni_id: string,
    teacher_id: string,
    data: TeacherInterface
  ) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const teacher = await this.TeachRepo.findOneBy({ id: teacher_id });
      if (!teacher) throw new Error("Teacher not found Not found");

      const update = this.TeachRepo.update(
        { id: teacher_id },
        {
          name: data.name,
          email: data.email,
          password: data.password,
          gender: data.gender,
          contact: data.contact,
        }
      );
      return "Teacher Update successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Teacher not found");
      }
    }
  }

  async getTeachers(uni_id: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) {
        throw new Error("University not found");
      }

      const teachers = await this.TeachRepo.find({
        where: { university: { id: uni_id } },
        relations: ["module"],
      });
      if (!teachers.length) {
        throw new Error("No teachers found for this university");
      }
      return teachers;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Failed to fetch teachers"
      );
    }
  }

  async getTeacherById(uni_id: string, teacherId: string) {
    try {
      const university = await this.uniRepo.findOneBy({ id: uni_id });
      if (!university) throw new Error("University not found");

      const teacher = await this.TeachRepo.findOne({
        where: { id: teacherId, university: { id: uni_id } },
      });

      if (!teacher) throw new Error("Teacher not found");

      return teacher;
    } catch (error: any) {
      throw new Error(error.message || "Failed to get teacher");
    }
  }

  async deleteTeacher(uni_id: string, teacher_id: string) {
    try {
      const teacher = await this.TeachRepo.findOne({
        where: { id: teacher_id, university: { id: uni_id } },
      });

      if (!teacher) {
        throw new Error(
          "Teacher not found or does not belong to the university"
        );
      }

      await this.TeachRepo.delete({ id: teacher_id });

      return "Teacher deleted successfully";
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addStudent(uni_id: string, program_id: string, data: StudentInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const program = await this.progRepo.findOneBy({ id: program_id });
      if (!program) throw new Error("Program Not found");

      const hashPassword = await bcryptservice.hash(data.password);

      const student = this.studentRepo.create({
        email: data.email,
        password: hashPassword,
        uni: uni,
        program: program,
      });
      await this.studentRepo.save(student);

      const studentDetails = this.studentDetailsRepo.create({
        first_name: data.details.first_name,
        middle_name: data.details.middle_name,
        last_name: data.details.last_name,
        phone_number: data.details.phone_number,
        DOB: data.details.DOB,
        gender: Gender[data.details.gender as keyof typeof Gender],
        student: student,
      });

      await this.studentDetailsRepo.save(studentDetails);
      return student;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async getStudent(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const students = await this.studentRepo.find({
        where: { uni: { id: uni_id } },
        relations: ["program", "details"],
      });

      return students;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async editStudent(
    uni_id: string,
    student_id: string,
    data: StudentInterface
  ) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const student = await this.studentRepo.findOne({
        where: { id: student_id },
        relations: ["details"],
      });
      if (!student) throw HttpException.notFound("Student not found");

      (student.email = data.email || student.email),
        (student.details.first_name =
          data.details.first_name || student.details.first_name),
        (student.details.middle_name =
          data.details.middle_name || student.details.middle_name);
      (student.details.last_name =
        data.details.last_name || student.details.last_name),
        (student.details.phone_number =
          data.details.phone_number || student.details.phone_number),
        (student.details.DOB = data.details.DOB || student.details.DOB),
        (student.details.gender =
          Gender[data.details.gender as keyof typeof Gender] ||
          student.details.gender);

      await this.studentRepo.save(student);
      await this.studentDetailsRepo.save(student.details);
      return student;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async deleteStudent(uni_id: string, student_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University Not found");

      const student = await this.studentRepo.findOne({
        where: { id: student_id, uni: { id: uni_id } },
        relations: ["details"],
      });
      if (!student) throw HttpException.notFound("Student not found");
      await this.studentRepo.delete({ id: student.id });

      return "Student deleted successfully";
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  async postAnnouncement(uni_id: string, data: AnnouncementInterface) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");
     

      const createAnnouncement = this.AnnouncementRepo.create({
        announce_name: data.announce_name,
        announce_title: data.announce_title,
        announce_date: data.announce_date,
        university: uni
      });


      const result = await this.AnnouncementRepo.save(createAnnouncement);
      return createAnnouncement;
    } catch (error) {
      if (error instanceof Error) {
        throw HttpException.badRequest(error.message);
      } else {
        throw HttpException.badRequest("Invalid data");
      }
    }
  }

  async getAnnouncement(uni_id: string){
    try{
    const uni = await this.uniRepo.findOneBy({ id: uni_id });
    if (!uni) throw new Error("University not found");

    const getAnnouncement = await this.AnnouncementRepo.find({
      where: {university: {id:uni_id}},
      relations: ["university"],
    });
    return getAnnouncement;
  }
  catch (error) {
    throw HttpException.badRequest("Failed to fetch announcements");
  }
}
async updateAnnouncement(
  uni_id: string,
  announcement_id: string,
  data: AnnouncementInterface
) {
  try {
    const uni = await this.uniRepo.findOneBy({ id: uni_id });
    if (!uni) throw new Error("University Not found");

    const announcement = await this.AnnouncementRepo.findOneBy({
      id: announcement_id,
      university: { id: uni_id },
    });
    if (!announcement) throw new Error("Announcement Not found");

    const updateAnnouncement = await this.AnnouncementRepo.update(
      {
        id: announcement_id,
      },
      {
        announce_name: data.announce_name,
        announce_title: data.announce_title,
        announce_date: data.announce_date
      }
    );
    return updateAnnouncement;
  } catch (error) {
    if (error instanceof Error) {
      throw HttpException.badRequest(error.message);
    } else {
      throw HttpException.badRequest("Invalid credentials");
    }
  }
}

async deleteAnnouncement(uni_id: string, announcement_id: string) {
  try {
    const uni = await this.uniRepo.findOneBy({ id: uni_id });
    if (!uni) throw new Error("Uni not found");

    const announcement = await this.AnnouncementRepo.findOneBy({ id: announcement_id });
    if (!announcement) throw new Error("No any Announcement found");

    await this.AnnouncementRepo.delete({ id: announcement.id });

    return "Announcement deleted successfully";
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    } else {
      throw new Error("Announcement not found");
    }
  }
}

  async approveRoutine(uni_id: string, routine_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const routine = await this.routineRepo.findOneBy({ id: routine_id });
      if (!routine) throw new Error("Exam routine not found");

      routine.status = RoutineStatus.APPROVED;
      routine.approved_by = uni;

      return await this.routineRepo.save(routine);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      } else {
        throw new Error("Failed to approve routine");
      }
    }
  }

  async getRoutinesForAdmin(uni_id: string) {
    try {
      const uni = await this.uniRepo.findOneBy({ id: uni_id });
      if (!uni) throw new Error("University not found");

      const routines = await this.routineRepo.find({
        relations: ["teacher", "module", "approved_by"],
      });

      return routines;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }
}

export default new UniversityService();
