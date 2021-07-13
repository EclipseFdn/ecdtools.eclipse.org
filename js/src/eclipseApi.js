/*!
 * Copyright (c) 2021 Eclipse Foundation, Inc.
 *
 * This program and the accompanying materials are made available under the
 * terms of the Eclipse Public License v. 2.0 which is available at
 * http://www.eclipse.org/legal/epl-2.0.
 *
 * Contributors:
 *   Christopher Guindon <chris.guindon@eclipse-foundation.org>
 *
 * SPDX-License-Identifier: EPL-2.0
 */

const EclipseApi = (function($, document) {
  // Eclipse News and events
  $("#news-list-container").eclipseFdnApi({
    type: "newsItems"
  });
  $("#event-list-container").eclipseFdnApi({
    type: "filteredEvents"
  });
})(jQuery, document);

export default EclipseApi;