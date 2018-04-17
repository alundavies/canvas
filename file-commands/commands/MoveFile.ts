/**
 * Created by alundavies on 09/04/2018.
 */
import {FileCommand} from "../FileCommand";

export default class MoveFile implements FileCommand {

    static readonly command = 'mv';

    execute(commandParams: any) : boolean {

        return true;
    }

}
