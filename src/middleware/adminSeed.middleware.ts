import BcryptService from "../utils/bcrypt.utils";
const bcryptservice = new BcryptService();
import { AppDataSource } from "../config/database.config";
import { University } from "../entities/university/university.entity";
import { Admin } from "../entities/admin/admin.entity";


class AdminSeed{

    constructor(
        private readonly AdminRepo = AppDataSource.getRepository(Admin),
    ){}

    // constructor(
    //
    // ){}

async  seedAdmin() {
  console.log("admin is seeding");

  const email = "admin@gmail.com";
  const password = "admin";
  const hashPassword = await bcryptservice.hash(password);
  const alreadyAdmin =await this.AdminRepo.findOne({where:{email}});
  if (alreadyAdmin) {
    console.log("Admin is already seeded.");
    return;
  }
  console.log("Seeding in progress.");
  const seed = this.AdminRepo.create({
    email,
    password: hashPassword,
  });
  console.log("🚀 ~ AdminSeed ~ seed:", seed)
  await this.AdminRepo.save(seed);
  console.log("Successfully seeded");
}}

export default new AdminSeed()