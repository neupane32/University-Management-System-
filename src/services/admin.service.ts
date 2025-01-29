import { Admin } from "../entities/admin.entity";
import { AppDataSource } from "../config/database.config";
import { AdminInterface } from "../interface/admin.interface";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
const bcryptservice = new BcryptService();

class AdminService {
    constructor (
        private readonly adminRepo = AppDataSource.getRepository(Admin)
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
                select: ['id', 'email', 'password'],
            });
            if (!adminLogin) throw HttpException.badRequest('The entered email is not registered yet');
            const isPassword = await bcryptservice.compare(data.password, adminLogin.password);
      if (!isPassword) throw HttpException.badRequest('Incorrect password');
      return await this.getUserById(adminLogin.id);
        } catch (error: any) {
            if (error instanceof Error) {
              throw HttpException.badRequest(error.message);
            } else {
              throw HttpException.badRequest('Invalid credentials');
            }
        }
    }

    async getUserById(id: string) {
        try {
          const query = this.adminRepo
            .createQueryBuilder('admin')
            .where('admin.id =:id', { id });
    
          const user = await query.getOne();
          if (!user) throw new Error('user not found');
          return user;
        } catch (error: unknown) {
          if (error instanceof Error) {
            throw new Error(error.message);
          } else {
            throw new Error('User not found');
          }
        }
      }
}

export default new AdminService();