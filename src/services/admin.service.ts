import { Admin } from "../entities/admin.entity";
import { AppDataSource } from "../config/database.config";
import { AdminInterface } from "../interface/admin.interface";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { University } from "../entities/university/university.entity";
const bcryptservice = new BcryptService();

class AdminService {
    constructor (
        private readonly adminRepo = AppDataSource.getRepository(Admin),
        private readonly uniRepo = AppDataSource.getRepository(University)

    ) {

    }
    async createAdmin(data:AdminInterface){
        try {
            const emailExist = await this.adminRepo.findOne({
                where: {
                    email: data.email,
                },
            });

            if (emailExist) throw new Error('The email is already registred');
            const hashPassword = await bcryptservice.hash(data.password);
            const admin = this.adminRepo.create({
                email: data.email,
                password: hashPassword,
            });
            await this.adminRepo.save(admin);
            return admin;
            
        } catch (error:unknown) {
            if (error instanceof Error) {
                throw new Error(error.message);
              } else {
                throw new Error('An unknown error occurred');
              }
            
        }
    }
    
    async loginAdmin(data:AdminInterface){
        try {
            const adminLogin = await this.adminRepo.findOne({
                where: [{ email : data.email}],
                select: ['id', 'email', 'password','role'],
            });
            if (!adminLogin) throw HttpException.badRequest('The entered email is not registered yet');
            const isPassword = await bcryptservice.compare(data.password, adminLogin.password);
      if (!isPassword) throw HttpException.badRequest('Incorrect password');
      return adminLogin;
        } catch (error) {
            if (error instanceof Error) {
              throw HttpException.badRequest(error.message);
            } else {
              throw HttpException.badRequest('Invalid credentials');
            }
        }
    }

    async viewUniversity(admin_id:string){
        try {
            const admin = await this.adminRepo.findOneBy({id:admin_id})
            if(!admin) throw new Error("Unauthorized")

                const universities = await this.uniRepo
                if(!universities) throw new Error("University not found")
                return universities
            } catch (error:any) {
              throw new Error(error.message)
            }
            
        } catch (error) {
            if (error instanceof Error) {
              throw HttpException.badRequest(error.message);
            } else {
              throw HttpException.badRequest('Invalid credentials');
            }
        }

        async deleteUniversity(admin_id:string, uni_id:string){
            try {
              const admin = await this.adminRepo.findOneBy({id:admin_id})
              if(!admin) throw new Error("Unauthorized")
        
                const uni = await this.uniRepo.findOneBy({id:uni_id})
              if(!admin) throw new Error("Not found")
        
                await this.uniRepo.delete({id:uni_id})
                return 'University deleted'
            } catch (error:any) {
              throw new Error(error.message)
            }
          }
    }

export default new AdminService();