/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {verifyDefaultAdapter} from '../helpers/foundation';
import MDCChipSetFoundation from '../../../packages/mdc-chips/chip-set/foundation';

const {cssClasses} = MDCChipSetFoundation;

suite('MDCChipSetFoundation');

test('exports strings', () => {
  assert.isOk('strings' in MDCChipSetFoundation);
});

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCChipSetFoundation);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCChipSetFoundation, [
    'hasClass', 'registerEventHandler', 'deregisterEventHandler',
  ]);
});

const setupTest = () => {
  const mockAdapter = td.object(MDCChipSetFoundation.defaultAdapter);
  const foundation = new MDCChipSetFoundation(mockAdapter);
  const chipA = td.object({
    toggleActive: () => {},
  });
  const chipB = td.object({
    toggleActive: () => {},
  });
  return {foundation, mockAdapter, chipA, chipB};
};

test('on custom MDCChip:interaction event toggles active state on choice chips', () => {
  const {foundation, mockAdapter, chipA, chipB} = setupTest();
  let chipInteractionHandler;
  td.when(mockAdapter.registerEventHandler('MDCChip:interaction', td.matchers.isA(Function)))
    .thenDo((evtType, handler) => {
      chipInteractionHandler = handler;
    });
  td.when(mockAdapter.hasClass(cssClasses.CHOICE)).thenReturn(true);

  assert.equal(foundation.activeChips_.length, 0);
  foundation.init();

  chipInteractionHandler({
    detail: {
      chip: chipA,
    },
  });
  td.verify(chipA.toggleActive());
  assert.equal(foundation.activeChips_.length, 1);

  chipInteractionHandler({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipA.toggleActive());
  td.verify(chipB.toggleActive());
  assert.equal(foundation.activeChips_.length, 1);

  chipInteractionHandler({
    detail: {
      chip: chipB,
    },
  });
  td.verify(chipB.toggleActive());
  assert.equal(foundation.activeChips_.length, 0);
});
