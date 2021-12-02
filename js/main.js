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
import './adopters-alternate.js'

const solsticeSliderHome = () => {
    var owl = $('.solstice-slider-home');
    owl.owlCarousel({
        items:1,
        autoplay:true,
        autoplayTimeout:6000,
        autoplayHoverPause:true,
        autoplaySpeed: 2000,
        loop:true,
    });
}

$(window).on("load", function() {
    solsticeSliderHome();
});



$("body").on("shown.ef.featured_story", function(e) {
    var owl = $('.solstice-slider-home');
    owl.trigger('destroy.owl.carousel');
    solsticeSliderHome();
    owl.trigger('refresh.owl.carousel');
});

(function (eclipseFdnAdoptersAlternate) {
    if (typeof eclipsefdn_adopters_configs !== 'undefined') {
      eclipseFdnAdoptersAlternate.getWGList({
        src_root: 'https://api.eclipse.org/adopters',
        working_group: eclipsefdn_adopters_configs.working_group,
        ul_classes: eclipsefdn_adopters_configs.ul_classes,
      });
    }
  })(eclipseFdnAdoptersAlternate);