import { AppDataSource } from "../config/database.config";
import { AdminInterface } from "../interface/admin.interface";
import BcryptService from "../utils/bcrypt.utils";
import HttpException from "../utils/HttpException.utils";
import { University } from "../entities/university/university.entity";
import { Admin } from "../entities/admin/admin.entity";
const bcryptservice = new BcryptService();

class AdminService {
    constructor (
        private readonly adminRepo = AppDataSource.getRepository(Admin),
        private readonly uniRepo = AppDataSource.getRepository(University)
    ) {
    }
    async loginAdmin(data:AdminInterface){
      if(!data.email || !data.password){
        throw HttpException.badRequest('Invalid credentials');

      }
      console.log("🚀 ~ AdminService ~ loginAdmin ~ data:", data)
      console.log(data.email,'----')
        try {
            const adminLogin = await this.adminRepo.findOne({
                where: { email : data.email},
                select: ['id', 'email', 'password','role'],
            });
            console.log("🚀 ~ AdminService ~ loginAdmin ~ adminLogin:", adminLogin)
            if (!adminLogin) throw HttpException.badRequest('The entered email is not registered yet');
            const isPassword = await bcryptservice.compare(data.password, adminLogin.password);
            console.log("🚀 ~ AdminService ~ loginAdmin ~ isPassword:", isPassword)
      if (!isPassword) throw HttpException.badRequest('Incorrect password');
      return adminLogin;
        } catch (error) {
            console.log("🚀 ~ AdminService ~ loginAdmin ~ error:", error)
            if (error instanceof Error) {
              throw HttpException.badRequest(error.message);
            } else {
              throw HttpException.badRequest('Invalid credentials');
            }
        }
    }
    }
export default new AdminService();