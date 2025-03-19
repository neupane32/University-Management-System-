import multer from "multer";
import path from "path";
import fs from "fs";
const ensureDirectoryExistence = (directory: fs.PathLike) => {
  if(!fs.existsSync(directory)){
    fs.mkdirSync(directory, { recursive: true });
  }
}
const universityProfileImagesPath = "uploads/universityProfileImages";
const teacherResoureFilePath = "uploads/teacherResourceFiles";
// const tournamentCoverImagesPath = "uploads/tournamentCoverImages";
// const gearImagesPath="uploads/gearImages";
// const bucksPath="uploads/buckImages"
// const scoreSubmissionPath="uploads/scoreSubmissionImages";
// const teamImagePath="uploads/teamImages";
ensureDirectoryExistence(universityProfileImagesPath);
 ensureDirectoryExistence(teacherResoureFilePath);
// ensureDirectoryExistence(tournamentCoverImagesPath);
// ensureDirectoryExistence(gearImagesPath);
// ensureDirectoryExistence(teamImagePath);
// ensureDirectoryExistence(bucksPath)
// ensureDirectoryExistence(scoreSubmissionPath)

//university Profile
const universityProfileStorage= multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname==='university_profile_image'){
      cb(null,universityProfileImagesPath );
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

//teacher resource
const teacherResourceStorage= multer.diskStorage({
  destination: (req, file, cb) => {
    if(file.fieldname==='teacher_resource_file'){
      cb(null,teacherResoureFilePath );
    }
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})
const fileFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only images are allowed!'), false);
  }
};
export const universityProfileImagesUpload = multer({
  storage: universityProfileStorage,
  fileFilter: fileFilter,
});

export const teacherResourceFileUpload = multer({
  storage: teacherResourceStorage
});


