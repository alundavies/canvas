import {CommandParams} from "./CommandParams";
/**
 * Created by alundavies on 09/04/2018.
 */

export interface FileCommand {

    execute( commandParams: CommandParams) : boolean;

}
