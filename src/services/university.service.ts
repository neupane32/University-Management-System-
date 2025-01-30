import { AppDataSource } from "../config/database.config";
import { UniversityInterface } from "../interface/university.interface";
import { University } from "../entities/university/university.entity";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { log } from "console";

const bcryptservice = new BcryptService();

class UniversityService {
    constructor(
        private readonly uniRepo = AppDataSource.getRepository(University)
    ){
        
    }

    async createUniversity (data:UniversityInterface) {
        try {
            const emailExist = await this.uniRepo.findOneBy({
                email: data.email,
            })

            if (emailExist) throw new Error ("The email is already exists");
            if(data.password !== data.confirm_password) throw new Error ("Please enter the same password")
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
              throw new Error('An unknown error occurred');
            }
          }

    }

    async loginUniversity(data: UniversityInterface) {
        try {
            const login = await this.uniRepo.findOne({
                where: [{ email: data.email }],
                select: ['id', 'email', 'password','role'],
            });
            // if(!user?.Verified) throw HttpException.unauthorized("Otp is not verified yet")
      if (!login) throw HttpException.badRequest('Entered email is not registered yet');
            const isPassword = await bcryptservice.compare(data.password, login.password);
            if (!isPassword) throw HttpException.badRequest('Incorrect password');
        } catch (error: any) {
            if (error instanceof Error) {
              throw HttpException.badRequest(error.message);
            } else {
              throw HttpException.badRequest('Invalid credentials');
            }
    }


}
}


export default new UniversityService();