import {Commander} from "./Commander";
import MoveFile from "./commands/MoveFile";
import {FileCommand} from "./FileCommand";
import CopyFile from "./commands/CopyFile";
/**
 * Created by alundavies on 09/04/2018.
 */

export default class LocalFileSystemCommander implements Commander {

    static registeredCommands = {
        'mv' : new MoveFile(),
        'cp' : new CopyFile()
    };

    constructor(){

    }

    execute(directory: string, commandId: string): boolean {
        throw new Error("Method not implemented.");
    }

}
