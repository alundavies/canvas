/**
 * Created by alundavies on 09/04/2018.
 */
export interface Commander {
    execute( directories: string[], commandIds: string[]) : boolean;
    commit( directories: string[], commandIds: string[]) : boolean;
}
