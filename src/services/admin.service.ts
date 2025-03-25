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
    }

export default new AdminService();