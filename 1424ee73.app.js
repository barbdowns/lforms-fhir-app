"use strict";angular.module("lformsApp",["ngCookies","ngResource","ngSanitize","ngRoute","ngAnimate","ngMaterial","lformsWidget","angularFileUpload"]).config(["$ariaProvider",function(e){e.config({tabindex:!1,bindRoleForClick:!1})}]).config(["$routeProvider","$locationProvider",function(e,n){e.when("/lforms-fhir-app",{templateUrl:"fhir-app/fhir-app.html",controller:"FhirAppCtrl"}).when("/",{templateUrl:"fhir-app/fhir-app.html",controller:"FhirAppCtrl"}),n.html5Mode(!0)}]);var LFormsUtil=LFormsUtil||{};LFormsUtil.copyToClipboard=function(e){window.getSelection().selectAllChildren(document.getElementById(e)),document.execCommand("Copy")},angular.module("lformsApp").controller("FhirAppContentCtrl",["$scope","$window","$http","$timeout","$routeParams","selectedFormData","$mdDialog","fhirService","userMessages",function(r,e,n,t,i,o,a,s,l){var c="R4";r.initialLoad=!0,r.previewOptions={hideCheckBoxes:!0},r.lfOptions={showQuestionCode:!0,showCodingInstruction:!1,tabOnInputFieldsOnly:!1,showFormHeader:!1},r.fhirResInfo={resId:null,resType:null,resTypeDisplay:null,extensionType:null,questionnaireResId:null,questionnaireName:null},r.userMessages=l,r.valueCleanUp=function(e){for(var n=angular.copy(e),t=0,i=n.itemList.length;t<i;t++)delete n.itemList[t].value;return n},r.saveQRToFhir=function(){$(".spinner").show(),"QuestionnaireResponse"===r.fhirResInfo.resType&&(r.fhirResInfo.resId?r.updateQRToFhir(r.fhirResInfo.extensionType):r.createQRToFhir(r.fhirResInfo.extensionType))},r.deleteFromFhir=function(){$(".spinner").show(),r.fhirResInfo.resId&&s.deleteFhirResource(r.fhirResInfo.resType,r.fhirResInfo.resId)},r.saveAsToFhir=function(e){$(".spinner").show(),"QR"===e?r.createQRToFhir():"SDC-QR"===e&&r.createQRToFhir("SDC")},r.saveDRToFhir=function(){var e=LForms.FHIR.createDiagnosticReport(r.formData,s.getCurrentPatient().resource,!0,"transaction");e?s.handleTransactionBundle(e):console.log("Failed to create a DiagnosticReport. "+JSON.stringify(r.formData))},r.createQRToFhir=function(e){$(".spinner").show();var n="SDC"!==e,t=LForms.Util.getFormFHIRData("QuestionnaireResponse",s.fhirVersion,r.formData,{noExtensions:n});if(t){var i=s.getCurrentPatient();if(i&&(t.subject={reference:"Patient/"+i.id,display:i.name}),delete t.id,r.fhirResInfo.questionnaireResId)t.questionnaire={reference:"Questionnaire/"+r.fhirResInfo.questionnaireResId},s.createFhirResource("QuestionnaireResponse",t,e);else{var o=r.valueCleanUp(r.formData),a=LForms.Util.getFormFHIRData("Questionnaire",s.fhirVersion,o);a?(delete a.id,s.createQQR(a,t,e)):console.log("Failed to create a Questionnaire. "+JSON.stringify(r.formData))}}else console.log("Failed to create a QuestionnaireResponse. "+JSON.stringify(r.formData))},r.updateQRToFhir=function(e){$(".spinner").show();var n="SDC"!==e;if(r.fhirResInfo.resId&&r.fhirResInfo.questionnaireResId){var t=LForms.Util.getFormFHIRData("QuestionnaireResponse",s.fhirVersion,r.formData,{noExtensions:n});if(t){var i=s.getCurrentPatient();i&&(t.subject={reference:"Patient/"+i.id,display:i.name}),t.questionnaire={reference:"Questionnaire/"+r.fhirResInfo.questionnaireResId},t.id=r.fhirResInfo.resId,s.updateFhirResource("QuestionnaireResponse",t)}else console.log("Failed to update a QuestionnaireResponse. "+JSON.stringify(r.formData))}},r.showHL7Segments=function(e){r.formData&&(r.hl7String=LForms.HL7.toHL7Segments(r.formData),a.show({scope:r,preserveScope:!0,templateUrl:"fhir-app/hl7-dialog.html",parent:angular.element(document.body),targetEvent:e}))},r.showFHIRDiagnosticReport=function(e){if(r.formData){var n=LForms.Util.getFormFHIRData("DiagnosticReport",c,r.formData,{bundleType:"collection"}),t=(n=LForms.FHIR.createDiagnosticReport(r.formData,s.getCurrentPatient().resource,!0,"collection"),JSON.stringify(n,null,2));r.fhirResourceString=t,r.fhirResourceTitle="FHIR DiagnosticReport Resource",a.show({scope:r,preserveScope:!0,templateUrl:"fhir-app/fhir-resource-dialog.html",parent:angular.element(document.body),targetEvent:e})}},r.showOrigFHIRQuestionnaire=function(e){var n=s.getCurrentQuestionnaire();if(n){var t=JSON.stringify(n,null,2);r.fhirResourceString=t,r.fhirResourceTitle="Questionnaire Resource from FHIR Server",a.show({scope:r,preserveScope:!0,templateUrl:"fhir-app/fhir-resource-dialog.html",parent:angular.element(document.body),targetEvent:e})}},r.showFHIRQuestionnaire=function(e){if(r.formData){var n=r.valueCleanUp(r.formData),t=LForms.Util.getFormFHIRData("Questionnaire",c,n,{noExtensions:!0}),i=JSON.stringify(t,null,2);r.fhirResourceString=i,r.fhirResourceTitle="FHIR Questionnaire Resource",a.show({scope:r,preserveScope:!0,templateUrl:"fhir-app/fhir-resource-dialog.html",parent:angular.element(document.body),targetEvent:e})}},r.showFHIRSDCQuestionnaire=function(e){if(r.formData){var n=r.valueCleanUp(r.formData),t=LForms.Util.getFormFHIRData("Questionnaire",c,n),i=JSON.stringify(t,null,2);r.fhirResourceString=i,r.fhirResourceTitle="FHIR SDC Questionnaire Resource",a.show({scope:r,preserveScope:!0,templateUrl:"fhir-app/fhir-resource-dialog.html",parent:angular.element(document.body),targetEvent:e})}},r.showFHIRQuestionnaireResponse=function(e){if(r.formData){var n=LForms.Util.getFormFHIRData("QuestionnaireResponse",c,r.formData,{noExtensions:!0}),t=JSON.stringify(n,null,2);r.fhirResourceString=t,r.fhirResourceTitle="FHIR QuestionnaireResponse Resource",a.show({scope:r,preserveScope:!0,templateUrl:"fhir-app/fhir-resource-dialog.html",parent:angular.element(document.body),targetEvent:e})}},r.showFHIRSDCQuestionnaireResponse=function(e){if(r.formData){var n=LForms.Util.getFormFHIRData("QuestionnaireResponse",c,r.formData),t=JSON.stringify(n,null,2);r.fhirResourceString=t,r.fhirResourceTitle="FHIR SDC QuestionnaireResponse Resource",a.show({scope:r,preserveScope:!0,templateUrl:"fhir-app/fhir-resource-dialog.html",parent:angular.element(document.body),targetEvent:e})}},r.closeDialog=function(){a.hide()},r.copyToClipboard=function(e){LFormsUtil.copyToClipboard(e)},r.$on("LF_FHIR_RESOURCE_CREATED",function(e,n){r.fhirResInfo.resId=n.resId,r.fhirResInfo.resType=n.resType,n.qResId&&(r.fhirResInfo.questionnaireResId=n.qResId,r.fhirResInfo.questionnaireName=n.qName),r.fhirResInfo.extensionType=n.extensionType,"QuestionnaireResponse"===n.resType&&n.extensionType?r.fhirResInfo.resTypeDisplay=n.resType+" ("+n.extensionType+")":r.fhirResInfo.resTypeDisplay=n.resType,$(".spinner").hide()}),r.$on("LF_FHIR_RESOURCE_DELETED",function(e,n){o.setFormData(null),r.initialLoad=!0,r.$apply(),$(".spinner").hide()}),r.$on("LF_NEW_DATA",function(){var e=o.getFormData();e&&(e.templateOptions.showFormHeader=!1),r.fhirResInfo=o.getFhirResInfo(),r.formData=e,r.initialLoad&&(r.initialLoad=!1),$(".spinner").hide()})}]),angular.module("lformsApp").controller("NavBarCtrl",["$scope","$http","$mdDialog","selectedFormData","fhirService","FileUploader","userMessages","$timeout",function(p,e,n,s,f,t,l,a){function c(){for(var e=Object.keys(l),n=0,t=e.length;n<t;++n)delete l[e[n]]}p.search={},p.uploader=new t({removeAfterUpload:!0}),p.listSavedQR=null,p.listSavedQ=null,p.formSelected={},p.obrItems=[{question:"Effective Date",questionCode:"date_done",dataType:"DT",answers:"",_answerRequired:!0,answerCardinality:{min:"1",max:"1"},displayControl:{colCSS:[{name:"width",value:"100%"},{name:"min-width",value:"4em"}]}}],p.loadFromFile=function(){document.querySelector("#inputAnchor").click()},p.uploader.onAfterAddingFile=function(e){s.setFormData(null),p.$apply(function(){c()});var n=new FileReader;n.onload=function(e){try{var n=JSON.parse(e.target.result)}catch(e){p.$apply(function(){l.error=e})}if(n)if(n.resourceType&&"Questionnaire"===n.resourceType){var t;try{var i=LForms.Util.detectFHIRVersion(n);if(!i){i=LForms.Util.guessFHIRVersion(n);var o='specified via meta.profile (see documentation for versioning <a href="http://build.fhir.org/versioning.html#mp-version">resources</a> and <a href="https://www.hl7.org/fhir/references.html#canonical">canonical URLs</a>.</p><p>Example 1:  http://hl7.org/fhir/3.5/StructureDefinition/Questionnaire (for Questionnaire version 3.5).<br>Example 2:  http://hl7.org/fhir/uv/sdc/StructureDefinition/sdc-questionnaire|3.5.0  (for SDC Questionnaire version 3.5).</p>';i?p.$apply(function(){l.htmlWarning="<p>Warning:  Assuming this resource is for FHIR version "+i+".To avoid this warning, please make sure the FHIR version is "+o}):p.$apply(function(){l.htmlError="<p>Could not determine the FHIR version for this resource.  Please make sure it is "+o})}i=LForms.Util.validateFHIRVersion(i),t=LForms.Util.convertFHIRQuestionnaireToLForms(n,i)}catch(e){p.$apply(function(){l.error=e})}t&&p.$apply(s.setFormData(new LFormsData(t)))}else p.$apply(s.setFormData(new LFormsData(n)))},n.readAsText(e._file),$("#inputAnchor")[0].value=""},p.pagingLinks={Questionnaire:{previous:null,next:null},QuestionnaireResponse:{previous:null,next:null}},p.hasPagingLink=function(e,n){return p.pagingLinks[e][n]},p.getPage=function(e,n){var t=p.pagingLinks[e][n];t&&f.getPage(e,n,t)},p.processPagingLinks=function(e,n){for(var t={previous:null,next:null},i=0,o=n.length;i<o;i++){var a=n[i];"previous"!==a.relation&&"next"!==a.relation||(t[a.relation]=a.url)}p.pagingLinks[e]=t},p.showSavedQQR=function(e,n){if(n&&"QuestionnaireResponse"===n.resType){$(".spinner").show(),c(),s.setFormData(null),p.formSelected={groupIndex:1,formIndex:e};var t,i=f.fhirVersion;try{var o=LForms.Util.convertFHIRQuestionnaireToLForms(n.questionnaire,i),a=new LFormsData(o).getFormData();t=LForms.Util.mergeFHIRDataIntoLForms("QuestionnaireResponse",n.questionnaireresponse,a,i)}catch(e){console.error(e),l.error="Sorry.  Could not process that QuestionnaireResponse.  See the console for details."}if(t){var r={resId:n.resId,resType:n.resType,resTypeDisplay:n.resTypeDisplay,extensionType:n.extensionType,questionnaireResId:n.questionnaire.id,questionnaireName:n.questionnaire.name};s.setFormData(new LFormsData(t),r),f.setCurrentQuestionnaire(n.questionnaire)}}},p.showSavedQuestionnaire=function(i,o){o&&"Questionnaire"===o.resType&&($(".spinner").show(),c(),s.setFormData(null),a(function(){p.formSelected={groupIndex:2,formIndex:i};try{var e=LForms.Util.convertFHIRQuestionnaireToLForms(o.questionnaire,f.fhirVersion)}catch(e){l.error=e}if(!l.error){var n=new LFormsData(e).getFormData(),t={resId:null,resType:null,resTypeDisplay:null,extensionType:null,questionnaireResId:o.resId,questionnaireName:o.questionnaire.name};s.setFormData(new LFormsData(n),t),f.setCurrentQuestionnaire(o.questionnaire)}},10))},p.isSelected=function(e,n){var t="";return p.formSelected&&p.formSelected.groupIndex===e&&p.formSelected.formIndex===n&&(t="active"),t},p.$on("LF_FHIR_QUESTIONNAIRERESPONSE_LIST",function(e,n){if(p.listSavedQR=[],n&&0<n.total){for(var t=0,i=n.entry.length;t<i;t++){var o=n.entry[t].resource;if("QuestionnaireResponse"===o.resourceType){var a;o.meta&&o.meta.lastUpdated?a=new Date(o.meta.lastUpdated).toString("MM/dd/yyyy HH:MM:ss"):o.authored&&(a=new Date(o.authored).toString("MM/dd/yyyy HH:MM:ss"));var r=null,s=null;if(o.questionnaire&&o.questionnaire.reference){var l=o.questionnaire.reference.slice("Questionnaire".length+1);r=f.findQuestionnaire(n,l)}if(r){s=r.name;var c=null;if(o.meta&&o.meta.profile)for(var d=0,u=o.meta.profile.length;d<u;d++)"http://hl7.org/fhir/us/sdc/StructureDefinition/sdc-questionnaireresponse"===o.meta.profile[d]&&(c="SDC");p.listSavedQR.push({resId:o.id,resName:s,updatedAt:a,resType:"QuestionnaireResponse",questionnaire:r,questionnaireresponse:o,extensionType:c,resTypeDisplay:c?"QuestionnaireResponse (SDC)":"QuestionnaireResponse"})}}}p.processPagingLinks("QuestionnaireResponse",n.link),p.$apply(),$(".spinner").hide()}}),p.$on("LF_FHIR_QUESTIONNAIRE_LIST",function(e,n){if(p.listSavedQ=[],n&&0<n.total){for(var t=0,i=n.entry.length;t<i;t++){var o,a=n.entry[t].resource;a.meta&&a.meta.lastUpdated?o=new Date(a.meta.lastUpdated).toString("MM/dd/yyyy HH:MM:ss"):a.date&&(o=new Date(a.date).toString("MM/dd/yyyy HH:MM:ss")),p.listSavedQ.push({resId:a.id,resName:a.name,updatedAt:o,resType:"Questionnaire",questionnaire:a,resTypeDisplay:"Questionnaire"})}p.processPagingLinks("Questionnaire",n.link),p.$apply()}$(".spinner").hide()}),p.$on("LF_FHIR_RESOURCE_DELETED",function(e,n){var t=f.getCurrentPatient();f.getAllQRByPatientId(t.id),f.getAllQ(),p.formSelected={},$(".spinner").hide()}),p.$on("LF_FHIR_RESOURCE_CREATED",function(e,n){var t=f.getCurrentPatient();f.getAllQRByPatientId(t.id),f.getAllQ(),p.formSelected={groupIndex:1,formIndex:0},$(".spinner").hide()}),p.$on("LF_FHIR_RESOURCE_UPDATED",function(e,n){var t=f.getCurrentPatient();f.getAllQRByPatientId(t.id),f.getAllQ(),p.formSelected={groupIndex:1,formIndex:0},$(".spinner").hide()}),p.selectedQuestionnaire=null,p.showQuestionnairePicker=function(e){p.selectedQuestionnaireInDialog=null,n.show({scope:p,preserveScope:!0,templateUrl:"fhir-app/questionnaire-select-dialog.html",parent:angular.element(document.body),targetEvent:e,controller:["$scope","$mdDialog",function(n,t){n.dialogTitle="Questionnaire Picker",n.dialogLabel="Choose a Questionnaire",n.dialogHint="Search for Questionnaires by name",n.closeDialog=function(){n.selectedQuestionnaireInDialog=null,t.hide()},n.confirmAndCloseDialog=function(){n.selectedQuestionnaire=angular.copy(n.selectedQuestionnaireInDialog.resource);var e=LForms.Util.convertFHIRQuestionnaireToLForms(n.selectedQuestionnaire);s.setFormData(new LFormsData(e)),f.setCurrentQuestionnaire(n.selectedQuestionnaire),n.selectedQuestionnaireInDialog=null,t.hide()}}]})},p.differentQuestionnaire=function(e,n){return e&&n&&e.id!==n.id},p.searchQuestionnaireByName=function(e){return f.searchQuestionnaireByName(e)}}]),angular.module("lformsApp").controller("FhirAppCtrl",["$scope","$timeout","$http","fhirService",function(n,e,t,i){n.selectedPatient=null,n.getPatientName=function(){return i.getPatientName(n.selectedPatient)},n.getPatientGender=function(){return n.selectedPatient.gender},n.getPatientDob=function(){return n.selectedPatient.birthDate},n.getPatientPhone=function(){return i.getPatientPhoneNumber(n.selectedPatient)},e(function(){n.getSmartReady()},1e3),n.getSmartReady=function(){FHIR.oauth2.ready(function(e){i.setSmartConnection(e),e.patient.read().then(function(e){n.selectedPatient=e,i.setCurrentPatient(e),i.getAllQRByPatientId(e.id),i.getAllQ(),n.$apply()})})}}]);var fb=angular.module("lformsApp");fb.service("fhirService",["$rootScope","$q","$http","$window",function(r,e,n,a){var s=this;s.currentPatient=null,s.connection=null,s.fhir=null,s.currentQuestionnaire=null,s.setSmartConnection=function(t){s.connection=t,s.fhir=t.api,LForms.Util.setFHIRContext({getCurrent:function(e,n){0<=e.indexOf("Patient")&&t.patient.read().then(function(e){n(e)})}}),s.requestedFHIRVersion||(s.fhir.conformance({}).then(function(e){var n=e.data.fhirVersion;s.fhirVersion=0===n.indexOf("3.")?"STU3":0===n.indexOf("4.")?"R4":n,r.fhirVersion=n,console.log("Server FHIR version is "+s.fhirVersion)}),s.requestedFHIRVersion=!0)},s.getSmartConnection=function(){return s.connection},s.setCurrentQuestionnaire=function(e){s.currentQuestionnaire=e,r.$broadcast("LF_FHIR_QUESTIONNAIRE_SELECTED",{resource:e})},s.getCurrentQuestionnaire=function(){return s.currentQuestionnaire},s.setCurrentPatient=function(e){s.currentPatient=e},s.getCurrentPatient=function(){return s.currentPatient},s.getPatientName=function(e){var n=e||s.currentPatient,t="";return n&&n.name&&0<n.name.length&&(n.name[0].given&&n.name[0].family?t=n.name[0].given[0]+" "+n.name[0].family:n.name[0].family?t=n.name[0].family:n.name[0].given&&(t=n.name[0].given[0])),t},s.getPatientPhoneNumber=function(e){var n=e||s.currentPatient,t="";if(n&&n.telecom)for(var i=0,o=n.telecom.length;i<o;i++)if("phone"===n.telecom[i].system&&n.telecom[i].value){t=n.telecom[i].use?n.telecom[i].use+": "+n.telecom[i].value:n.telecom[i].value;break}return t},s.getPage=function(n,e,t){var i,o=a.location.origin+"/fhir-api?";t=t.replace(/^.*\/baseDstu3\?/,o);"next"===e?i=s.fhir.nextPage:"previous"===e&&(i=s.fhir.prevPage),i({bundle:{resourceType:"Bundle",type:"searchset",link:[{relation:e,url:t}]}}).then(function(e){"Questionnaire"===n?r.$broadcast("LF_FHIR_QUESTIONNAIRE_LIST",e.data):"QuestionnaireResponse"===n&&r.$broadcast("LF_FHIR_QUESTIONNAIRERESPONSE_LIST",e.data)},function(e){console.log(e)})},s.searchPatientByName=function(e){return s.fhir.search({type:"Patient",query:{name:e},headers:{"Cache-Control":"no-cache"}}).then(function(e){var n=[];if(e&&e.data.entry)for(var t=0,i=e.data.entry.length;t<i;t++){var o=e.data.entry[t].resource;n.push({name:s.getPatientName(o),gender:o.gender,dob:o.birthDate,phone:s.getPatientPhoneNumber(o),id:o.id,resource:o})}return n},function(e){console.log(e)})},s.searchQuestionnaireByName=function(e){return s.fhir.search({type:"Questionnaire",query:{name:e},headers:{"Cache-Control":"no-cache"}}).then(function(e){var n=[];if(e&&e.data.entry)for(var t=0,i=e.data.entry.length;t<i;t++){var o=e.data.entry[t].resource;n.push({name:o.name,status:o.status,id:o.id,resource:o})}return n},function(e){console.log(e)})},s.getFhirResourceById=function(n,t){s.fhir.read({type:n,id:t}).then(function(e){r.$broadcast("LF_FHIR_RESOURCE",{resType:n,resource:e.data,resId:t})},function(e){console.log(e)})},s.getMergedQQR=function(e,n){s.fhir.search({type:e,query:{_id:n,_include:"QuestionnaireResponse:questionnaire"},headers:{"Cache-Control":"no-cache"}}).then(function(e){var n={qResource:null,qrResource:null},t=e.data.entry.length;if(0===t);else if(1===t||2===t)for(var i=0;i<t;i++){var o=e.data.entry[i].resource;"QuestionnaireResponse"===o.resourceType?n.qrResource=o:"Questionnaire"===o.resourceType&&(n.qResource=o)}r.$broadcast("LF_FHIR_MERGED_QQR",n)},function(e){console.log(e)})},s.createQQR=function(i,o,a){var e={identifier:"http://loinc.org|"+i.identifier[0].value};s.fhir.search({type:"Questionnaire",query:e,headers:{"Cache-Control":"no-cache"}}).then(function(e){var n=e.data;if(0<(n.entry&&n.entry.length||0)){var t=n.entry[0].resource.id;o.questionnaire={reference:"Questionnaire/"+t},s.fhir.create({resource:o}).then(function(e){r.$broadcast("LF_FHIR_RESOURCE_CREATED",{resType:"QuestionnaireResponse",resource:e.data,resId:e.data.id,qResId:t,qName:i.name,extensionType:a})},function(e){console.log(e)})}else s.fhir.create({resource:i}).then(function(e){var n=e.data.id;o.questionnaire={reference:"Questionnaire/"+n},s.fhir.create({resource:o}).then(function(e){r.$broadcast("LF_FHIR_RESOURCE_CREATED",{resType:"QuestionnaireResponse",resource:e.data,resId:e.data.id,qResId:t,qName:i.name,extensionType:a})},function(e){console.log(e)})},function(e){console.log(e)})},function(e){console.log(e)})},s.createFhirResource=function(n,t,i){s.fhir.create({resource:t}).then(function(e){t.id=e.data.id,r.$broadcast("LF_FHIR_RESOURCE_CREATED",{resType:n,resource:e.data,resId:e.data.id,extensionType:i})},function(e){console.log(e)})},s.updateFhirResource=function(n,t){s.fhir.update({resource:t}).then(function(e){r.$broadcast("LF_FHIR_RESOURCE_UPDATED",{resType:n,resource:e.data,resId:t.id})},function(e){console.log(e)})},s.deleteFhirResource=function(n,t){s.fhir.delete({type:n,id:t}).then(function(e){r.$broadcast("LF_FHIR_RESOURCE_DELETED",{resType:n,resource:null,resId:t})},function(e){console.log(e)})},s.getDRAndObxBundle=function(e,n){s.fhir.search({type:"DiagnosticReport",query:{_id:n,_include:"DiagnosticReport:result"},headers:{"Cache-Control":"no-cache"}}).then(function(e){r.$broadcast("LF_FHIR_DR_OBX_BUNDLE",e.data)},function(e){console.log(e)})},s.handleTransactionBundle=function(e){s.fhir.transaction({bundle:e}).then(function(e){console.log("transaction succeeded"),console.log(e)},function(){console.log(response)})},s.getAllQRByPatientId=function(e){s.fhir.search({type:"QuestionnaireResponse",query:{subject:"Patient/"+e,_include:"QuestionnaireResponse:questionnaire",_sort:"-authored",_count:10},headers:{"Cache-Control":"no-cache"}}).then(function(e){r.$broadcast("LF_FHIR_QUESTIONNAIRERESPONSE_LIST",e.data)},function(e){console.log(e)})},s.findQuestionnaire=function(e,n){var t=null;if(e)for(var i=0,o=e.entry.length;i<o;i++){var a=e.entry[i].resource;if("Questionnaire"===a.resourceType&&a.id===n){t=a;break}}return t},s.getAllQ=function(){s.fhir.search({type:"Questionnaire",query:{_sort:"-date",_count:10},headers:{"Cache-Control":"no-cache"}}).then(function(e){r.$broadcast("LF_FHIR_QUESTIONNAIRE_LIST",e.data)},function(e){console.log(e)})}}]),angular.module("lformsApp").service("selectedFormData",["$rootScope",function(t){var i={lfData:null,fhirResInfo:{resId:null,resType:null,resTypeDisplay:null,extensionType:null,questionnaireResId:null,questionnaireName:null}};return{getFormData:function(){return i.lfData},getFhirResInfo:function(){return i.fhirResInfo},getFhirResourceId:function(){return i.fhirResInfo.resId},getFhirResourceType:function(){return i.fhirResInfo.resType},setFormData:function(e,n){i.lfData=e,i.fhirResInfo=n||{resId:null,resType:null,resTypeDisplay:null,extensionType:null,questionnaireResId:null,questionnaireName:null},t.$broadcast("LF_NEW_DATA")}}}]),angular.module("lformsApp").service("userMessages",["$rootScope",function(e){return{}}]),angular.module("lformsApp").run(["$templateCache",function(e){e.put("fhir-app/fhir-app-content.html",'<div class=demo-app ng-controller=FhirAppContentCtrl>\x3c!--<p class="status-bar" ng-if="formData">--\x3e\x3c!--<span class="status-label" flex="50">--\x3e\x3c!--<span class="">Resource Type:</span>--\x3e\x3c!--<span class="text-primary">{{fhirResInfo.resTypeDisplay}}</span>--\x3e\x3c!--</span>--\x3e\x3c!--<span class="status-label" flex="50">--\x3e\x3c!--<span class="">Resource ID:</span>--\x3e\x3c!--<span class="text-primary">{{fhirResInfo.resId}}</span>--\x3e\x3c!--</span>--\x3e\x3c!--</p>--\x3e<div class="btn-group btn-group-sm" role=group ng-if=formData><button ng-if="formData && fhirResInfo.resId" type=button class="btn btn-primary" ng-click=saveQRToFhir() id=btn-save data-toggle=tooltip data-placement=bottom title="Save/Update the form data as a FHIR resource to the selected FHIR server."><span class="glyphicon glyphicon-cloud-upload"></span> <span>Save</span></button> <button ng-if="formData && fhirResInfo.resId" type=button class="btn btn-primary" ng-click=deleteFromFhir() id=btn-delete data-toggle=tooltip data-placement=bottom title="Delete the FHIR resource from the selected FHIR server."><span class="glyphicon glyphicon-trash"></span> <span>Delete</span></button></div><div class="btn-group btn-group-sm" role=group ng-if=formData><button type=button class="btn dropdown-toggle btn-primary" data-toggle=dropdown aria-haspopup=true aria-expanded=false id=btn-save-as data-toggle=tooltip data-placement=bottom title="Save the form data as a \'new\' FHIR resource to the selected FHIR server."><span class="glyphicon glyphicon-share"></span> <span>Save As ... </span><span class=caret></span></button><ul class=dropdown-menu><li><a href=# id=btn-save-qr ng-click="saveAsToFhir(\'QR\')">FHIR QuestionnaireResponse</a></li><li><a href=# id=btn-save-sdc-qr ng-click="saveAsToFhir(\'SDC-QR\')">FHIR QuestionnaireResponse (SDC)</a></li>\x3c!--<li><a href="#" class="" ng-click="saveAsToFhir(\'DR\')">FHIR DiagnosticReport</a></li>--\x3e</ul></div><div class="btn-group btn-group-sm" role=group ng-if=formData><button type=button class="btn dropdown-toggle btn-primary" data-toggle=dropdown aria-haspopup=true aria-expanded=false id=btn-show-as data-toggle=tooltip data-placement=bottom title="Show\n     the form data as a FHIR resource in a popup window."><span class="glyphicon glyphicon-modal-window"></span> <span>Show As ... </span><span class=caret></span></button><ul class=dropdown-menu><li ng-if=fhirResInfo.questionnaireResId><a id=show-q-from-server href=# ng-click=showOrigFHIRQuestionnaire()>FHIR Questionnaire from Server</a></li><li ng-if=fhirResInfo.questionnaireResId role=separator class=divider></li><li><a id=show-q href=# ng-click=showFHIRQuestionnaire()>FHIR Questionnaire</a></li><li><a id=show-qr href=# ng-click=showFHIRQuestionnaireResponse()>FHIR QuestionnaireResponse</a></li><li role=separator class=divider></li><li><a id=show-sdc-q href=# ng-click=showFHIRSDCQuestionnaire()>FHIR Questionnaire (SDC)</a></li><li><a id=show-sdc-qr href=# ng-click=showFHIRSDCQuestionnaireResponse()>FHIR QuestionnaireResponse (SDC)</a></li>\x3c!--<li role="separator" class="divider"></li>--\x3e\x3c!--<li><a href="#" class="" ng-click="showFHIRDiagnosticReport()">FHIR DiagnosticReport</a></li>--\x3e\x3c!--<li role="separator" class="divider"></li>--\x3e\x3c!--<li><a href="#" class="" ng-click="showHL7Segments()">HL7 v2 Message</a></li>--\x3e</ul></div><div ng-if=initialLoad ng-include="\'initial.html\'"></div><div ng-if=userMessages.error class=error>{{userMessages.error}}</div><div ng-if=userMessages.htmlError class=error ng-bind-html=userMessages.htmlError></div><div ng-if=userMessages.htmlWarning class=warning ng-bind-html=userMessages.htmlWarning></div><div ng-if="!initialLoad && !formData && !userMessages.error &&\n    !userMessages.htmlError" ng-include="\'loading.html\'"></div><lforms lf-data=formData lf-options=lfOptions></lforms>\x3c!-- inline templates. these could be in template files too. --\x3e<script type=text/ng-template id=initial.html><div class="loading initial">\n      <span>Please select a FHIR resource or upload from file.</span>\n    </div><\/script><script type=text/ng-template id=loading.html><div class="loading">\n      <span>Loading...</span>\n    </div><\/script>\x3c!-- end of inline templates --\x3e</div>'),e.put("fhir-app/fhir-app-navbar.html",'<div ng-controller=NavBarCtrl><div class="panel panel-default"><div class=panel-heading><div class=panel-title>Saved QuestionnaireResponses:</div></div><div class=panel-body><div ng-if=!listSavedQR>Loading QuestionnaireResponses from server...</div><div ng-if="listSavedQR && listSavedQR.length==0">No saved QuestionnaireResponse resources were found for this patient.</div><div ng-if="listSavedQR && listSavedQR.length>0" id=qrList class=list-group><a href=# class="list-group-item {{isSelected(1, $index)}}" ng-repeat="p in listSavedQR" role=presentation id={{p.resId}} ng-click="showSavedQQR($index, p)"><p class=form-name>{{p.resName}}</p><p class=res-type ng-if=p.extensionType>{{p.resTypeDisplay}}</p><p class=last-updated>{{p.updatedAt}}</p></a><div class="btn-group btn-group-justified" role=group><a role=button type=button class="btn btn-default btn-sm glyphicon glyphicon-chevron-left" ng-disabled="!hasPagingLink(\'QuestionnaireResponse\',\'previous\')" ng-click="getPage(\'QuestionnaireResponse\', \'previous\')"></a> <a role=button type=button class="btn btn-default btn-sm glyphicon glyphicon-chevron-right" ng-disabled="!hasPagingLink(\'QuestionnaireResponse\',\'next\')" ng-click="getPage(\'QuestionnaireResponse\', \'next\')"></a></div></div></div></div><div class="panel panel-default"><div class=panel-heading><div class=panel-title>Available Questionnaires:</div></div><div class=panel-body id=qListContainer><div ng-if=!listSavedQ>Loading Questionnaires from server...</div><div ng-if="listSavedQ && listSavedQ.length==0">No saved Questionnaire resources were found. Try uploading one.</div><div ng-if="listSavedQ && listSavedQ.length>0" id=qList class=list-group><a href=# class="list-group-item {{isSelected(2, $index)}}" ng-repeat="p in listSavedQ" role=presentation id={{p.resId}} ng-click="showSavedQuestionnaire($index, p)"><p class=form-name>{{p.resName}}</p><p class=last-updated>{{p.updatedAt}}</p></a><div class="btn-group btn-group-justified" role=group><a role=button type=button class="btn btn-default btn-sm glyphicon glyphicon-chevron-left" ng-disabled="!hasPagingLink(\'Questionnaire\',\'previous\')" ng-click="getPage(\'Questionnaire\', \'previous\')"></a> <a role=button type=button class="btn btn-default btn-sm glyphicon glyphicon-chevron-right" ng-disabled="!hasPagingLink(\'Questionnaire\',\'next\')" ng-click="getPage(\'Questionnaire\', \'next\')"></a></div><div class="btn-group btn-group-justified" role=group><a role=button type=button class="btn btn-default btn-sm btn-success" ng-click=showQuestionnairePicker($event) title="Choose a Questionnaire from the FHIR server."><span class="glyphicon glyphicon-search"></span><span class=lf-nav-button>Search</span></a></div></div></div></div><div class="panel panel-default">\x3c!--<div class="panel-heading">--\x3e\x3c!--<div class="panel-title">--\x3e\x3c!--Upload From File:--\x3e\x3c!--</div>--\x3e\x3c!--</div>--\x3e<div class=panel-body><input type=file id=inputAnchor nv-file-select uploader=uploader class=hide><div class="btn-group btn-group-justified" role=group><a id=upload role=button type=button class="btn btn-default btn-sm btn-success" ng-click=loadFromFile() title="Upload a file."><span class="glyphicon glyphicon-upload"></span><span class=lf-nav-button>Upload</span></a></div><p>If you do not have a Questionnaire of your own to upload, you can try downloading one of our <a href=https://raw.githubusercontent.com/lhncbc/lforms-fhir-app/master/e2e-tests/data/R4/weight-height-questionnaire.json target=_blank rel="noopener noreferrer" id=sampleQ>samples</a> (saving it to file, and then uploading it here).</p></div></div></div>'),e.put("fhir-app/fhir-app.html",'\x3c!-- page header --\x3e<div id=header><a href=http://lhncbc.nlm.nih.gov title="Lister Hill Center" id=logo><img src=assets/images/lhncbc.jpg alt="Lister Hill Center"></a><div id=siteNameBox><span id=siteName>SDC Questionnaire App</span><br></div><div id=tagLine>An open-source app for Structured Data Capture Questionnaires, powered by the <a target=_blank rel=noopener href=https://lhcforms.nlm.nih.gov>LHC-Forms</a> form rendering widget</div><div id=version>Version: <a target=_blank rel="noopener noreferrer" href=https://github.com/lhncbc/lforms-fhir-app/blob/master/CHANGELOG.md>0.5.0</a></div></div>\x3c!-- end page header --\x3e<div ng-controller=FhirAppCtrl><md-toolbar class=lf-patient><div class=md-toolbar-tools><span class="glyphicon glyphicon-user"></span> <span ng-if=selectedPatient flex="" class=lf-patient-info><div class="col-xs-6 col-md-3">Name: {{getPatientName()}}</div><div class="col-xs-6 col-md-3">Gender: {{getPatientGender()}}</div><div class="col-xs-6 col-md-3">DoB: {{getPatientDob()}}</div><div class="col-xs-6 col-md-3">Phone: {{getPatientPhone()}}</div></span></div></md-toolbar><md-content><div class=lf-content><div class="col-md-3 form-nav" ng-include="\'fhir-app/fhir-app-navbar.html\'"></div><div class="col-md-9 form-content" ng-include="\'fhir-app/fhir-app-content.html\'"></div></div></md-content></div>\x3c!-- page footer --\x3e<div id=fine-print><ul class=horz-list><li><a title="NLM copyright information" href=http://www.nlm.nih.gov/copyright.html>Copyright</a></li><li><a title="NLM privacy policy" href=http://www.nlm.nih.gov/privacy.html>Privacy</a></li><li><a title="NLM accessibility" href=http://www.nlm.nih.gov/accessibility.html>Accessibility</a></li><li><a title="NIH Freedom of Information Act office" href=http://www.nih.gov/icd/od/foia/index.htm>Freedom of Information Act</a></li><li class=last-item><a title=USA.gov href=http://www.usa.gov/ ><img src=assets/images/USAgov.gif alt=USA.gov id=usagov></a></li></ul><ul class=horz-list><li><a title="U.S. National Library of Medicine" href=http://www.nlm.nih.gov/ >U.S. National Library of Medicine</a></li><li><a title="U.S. National Institutes of Health" href=http://www.nih.gov/ >U.S. National Institutes of Health</a></li><li class=last-item><a title="U.S. Department of Health and Human Services" href=http://www.hhs.gov/ >U.S. Department of Health and Human Services</a></li></ul></div>\x3c!-- end page footer --\x3e'),e.put("fhir-app/fhir-resource-dialog.html",'<md-dialog flex=50 ng-controller=FhirAppContentCtrl><form><md-toolbar><div class=md-toolbar-tools><h2 ng-bind-html=fhirResourceTitle></h2></div></md-toolbar><md-dialog-content><div><pre id=message-body ng-bind-html=fhirResourceString></pre></div></md-dialog-content><md-dialog-actions layout=row><md-button aria-label="Copy to clipboard" ng-click="copyToClipboard(\'message-body\')" class=md-primary>Copy to Clipboard</md-button><md-button id=close-res-dialog aria-label="Close dialog" ng-click=closeDialog() class=md-primary>Close</md-button></md-dialog-actions></form></md-dialog>'),e.put("fhir-app/hl7-dialog.html",'<md-dialog flex=50 ng-controller=FhirAppContentCtrl><form><md-toolbar><div class=md-toolbar-tools><h2>HL7 OBR & OBX Segments</h2></div></md-toolbar><md-dialog-content><div><p>Please note that this is still a work in progress, and the code system values might be incorrect in some places.</p><pre id=message-body ng-bind-html=hl7String></pre></div></md-dialog-content><md-dialog-actions layout=row><md-button aria-label="Copy to clipboard" ng-click="copyToClipboard(\'message-body\')" class=md-primary>Copy to Clipboard</md-button><md-button aria-label="Close dialog" ng-click=closeDialog() class=md-primary>Close</md-button></md-dialog-actions></form></md-dialog>'),e.put("fhir-app/patient-select-dialog.html",'<md-dialog flex=45><form><md-toolbar><div class=md-toolbar-tools><h2 ng-bind-html=dialogTitle></h2></div></md-toolbar><md-dialog-content><div><p>{{dialogLabel}}</p><div layout=column ng-cloak><md-content layout-padding layout=column><form><md-autocomplete md-no-cache=false md-selected-item=selectedPatientInDialog md-search-text=patientSearchText md-items="item in searchPatientByName(patientSearchText)" md-item-text=item.name md-min-length=1 placeholder={{dialogHint}} md-menu-class=autocomplete-custom-template class=lf-patient-search><md-item-template><span class=item-title><span class="glyphicon glyphicon-user"></span> <span class=item-property><strong>{{item.name}} </strong></span></span><span class=item-metadata><span class=item-property>Gender: <strong>{{item.gender}}</strong> </span><span class=item-property>DoB: <strong>{{item.dob}}</strong> </span><span class=item-property>Phone: <strong>{{item.phone}}</strong></span></span></md-item-template><md-not-found>No patients found.</md-not-found></md-autocomplete></form></md-content></div></div></md-dialog-content><md-dialog-actions layout=row class=lost-data-warning ng-if="differentPatient(selectedPatient, selectedPatientInDialog)"><span>* Unsaved data in the form will be lost if you choose a difference patient.</span> <span flex></span></md-dialog-actions><md-dialog-actions layout=row><md-button id=btnOK ng-if=selectedPatientInDialog aria-label=OK ng-click=confirmAndCloseDialog() class=md-primary>OK</md-button><md-button id=btnCancel aria-label=Cancel ng-click=closeDialog() class=md-primary>Cancel</md-button></md-dialog-actions></form></md-dialog>'),e.put("fhir-app/questionnaire-select-dialog.html",'<md-dialog flex=45><form><md-toolbar><div class=md-toolbar-tools><h2 ng-bind-html=dialogTitle></h2></div></md-toolbar><md-dialog-content><div><p>{{dialogLabel}}</p><div layout=column ng-cloak><md-content layout-padding layout=column><form><md-autocomplete md-no-cache=false md-selected-item=selectedQuestionnaireInDialog md-search-text=questionnaireSearchText md-items="item in searchQuestionnaireByName(questionnaireSearchText)" md-item-text=item.name md-min-length=1 placeholder={{dialogHint}} md-menu-class=autocomplete-custom-template class=lf-patient-search><md-item-template><span class=item-title><span class="glyphicon glyphicon-user"></span> <span class=item-property><strong>{{item.name}} </strong></span></span><span class=item-metadata><span class=item-property>Status: <strong>{{item.status}}</strong></span></span></md-item-template><md-not-found>No Questionnaires found.</md-not-found></md-autocomplete></form></md-content></div></div></md-dialog-content><md-dialog-actions layout=row class=lost-data-warning ng-if="differentQuestionnaire(selectedQuestionnaire, selectedQuestionnaireInDialog)"><span>* Unsaved data in the form will be lost if you choose a difference Questionnaire.</span> <span flex></span></md-dialog-actions><md-dialog-actions layout=row><md-button id=btnOK ng-if=selectedQuestionnaireInDialog aria-label=OK ng-click=confirmAndCloseDialog() class=md-primary>OK</md-button><md-button id=btnCancel aria-label=Cancel ng-click=closeDialog() class=md-primary>Cancel</md-button></md-dialog-actions></form></md-dialog>')}]);