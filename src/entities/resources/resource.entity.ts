import { Module } from "../../entities/module/module.entity";
import { MediaType } from "../../constant/enum";
import Base from "../../entities/base.entity";
import { AfterLoad, Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { University } from "../../entities/university/university.entity";
import path from "path";
import fs from 'fs';
import { getTempFolderPath, getUploadFolderpath } from "../../utils/path.utils";
import { DotenvConfig } from "../../config/env.config";


@Entity('resource')

export class Resource extends Base{

@Column()
name: string;

@Column()
title: string;

@Column({name: 'mimetype'})
mimetype: string

@Column({enum: MediaType, type: 'enum'})
type: MediaType

@ManyToOne(() => Module, (module) => module.resource, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'module_id' })
module: Module;

@ManyToOne(() => University, (university) => university.resources, { onDelete: 'CASCADE' })
@JoinColumn({ name: 'university_id' })
university: University;

public path:string;

// Method to transfer files from temp to upload folder
transferFileFromTempToUpload(id: string, type: MediaType): void {
    const TEMP_PATH = path.join(getTempFolderPath(), this.name);
    const UPLOAD_PATH = path.join(getUploadFolderpath(), type.toLowerCase(), this.id.toString());
    !fs.existsSync(UPLOAD_PATH) && fs.mkdirSync(UPLOAD_PATH, { recursive: true });
    fs.renameSync(TEMP_PATH, path.join(UPLOAD_PATH, this.name));
  }

  // Automatically load the file path after the entity is loaded
  @AfterLoad()
  async loadFilePath(): Promise<void> {
    this.path = `${DotenvConfig.BASE_URL}/${this.type.toLowerCase()}/${this.id.toString()}/${this.name}`;
  }

}