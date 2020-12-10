/*******************************************************************************
* Copyright 2019 Amazon.com, Inc. and its affiliates. All Rights Reserved.
*
* Licensed under the Amazon Software License (the "License").
* You may not use this file except in compliance with the License.
* A copy of the License is located at
*
*   http://aws.amazon.com/asl/
*
* or in the "license" file accompanying this file. This file is distributed
* on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
* express or implied. See the License for the specific language governing
* permissions and limitations under the License.
*
********************************************************************************/
/**
 * [logger module]
 * V56536055 - 10/08/2018 - better logging capabilities
 */
'use strict';

class Logger {

  constructor() {
    this.loglevel = process.env.LOG_LEVEL;
    this.LOGLEVELS = {
      ERROR: 1,
      WARN: 2,
      INFO: 3,
      DEBUG: 4
    };
  }

  log(level, message) {
    if (this.LOGLEVELS[level] <= this.LOGLEVELS[this.loglevel])
      console.log(`[${level}]${message}`);
  }

}

module.exports = Object.freeze(Logger);
