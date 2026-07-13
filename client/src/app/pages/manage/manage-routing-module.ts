import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';
import { Manage } from './manage';

/**
 * Matches both "/manage" and "/manage/:pm2ProcessName" against a single route
 * config, so selecting a process only updates the params instead of destroying
 * and recreating the component (which would drop the opened log socket).
 *
 * PM2 names may contain slashes ("api/v1"), so every remaining segment is
 * consumed and rejoined into a single param, mirroring the "log{/*name}" route
 * of the socket server.
 */
function pm2ProcessNameMatcher(segments: UrlSegment[]): UrlMatchResult | null {
  if (segments.length === 0) {
    return { consumed: [] };
  }

  const path = segments.map(x => x.path).join('/');
  return {
    consumed: segments,
    posParams: { pm2ProcessName: new UrlSegment(path, {}) }
  };
}

const routes: Routes = [
  {
    matcher: pm2ProcessNameMatcher,
    component: Manage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManageRoutingModule {}
