/**
 * Created by alundavies on 09/04/2018.
 */
import {FileCommand} from "../FileCommand";

export default class CopyFile implements FileCommand {

    static readonly command = 'cp';

    execute(commandParams: any) : boolean {

        return true;
    }

}
