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

import 'eclipsefdn-solstice-assets'
import './src/userprofile'
import './src/projects'
import './src/eclipseApi'
import 'jquery-parallax.js/parallax.min.js'
import './src/parallax'


var owl = $('.solstice-slider-home');
owl.owlCarousel({
    items:1,
    autoplay:true,
    autoplayTimeout:6000,
    autoplayHoverPause:true,
    autoplaySpeed: 2000,
    loop:true,
});