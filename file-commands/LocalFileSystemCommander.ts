/**
 * Created by alundavies on 09/04/2018.
 */
import {Commander} from "./Commander";
import MoveFile from "./commands/MoveFile";
import CopyFile from "./commands/CopyFile";
import {CommandParams} from "./CommandParams";

export default class LocalFileSystemCommander implements Commander {


    static registeredCommands = {
        [MoveFile.command] : new MoveFile(),
        [CopyFile.command] : new CopyFile()
    };

    constructor(){

    }

    execute( directories: string[], commandIds: string[]): boolean {
        return undefined;
    }

    commit( directories: string[], commandIds: string[]) : boolean {
        // get all files in all directories with one of the commandIds specified
        return true;
    }
}
