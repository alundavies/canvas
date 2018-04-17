/**
 * Created by alundavies on 15/04/2018.
 */

// Render to an intermediate or snapshot file, snapshotter can take a rendered file and produce a snapshot if necessary

// e.g. render a .ts file as .html, with included code mirror imports etc.

export interface Renderer {
    render( target: string) : void
}