/**
 * Created by alundavies on 09/04/2018.
 */
export interface Commander {
    execute( directory: string, commandId: string) : boolean;
}
