const autoBind = require('auto-bind');

class CollaborationsHandler {
  constructor(collaborationsService, notesService, validator) {
    this.collaborationsService = collaborationsService;
    this.notesService = notesService;
    this.validator = validator;

    autoBind(this);
  }
  async postCollaborationHandler(request, h) {
    this.validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;

    await this.notesService.verifyNoteOwner(noteId, credentialId);
    const collaborationId = await this.collaborationsService.addCollaboration(
      noteId,
      userId,
    );

    const response = h.response({
      status: 'success',
      message: 'Kolaborasi berhasil ditambahkan',
      data: {
        collaborationId,
      },
    });
    response.code(201);
    return response;
  }

  async deleteCollaborationHandler(request) {
    this.validator.validateCollaborationPayload(request.payload);
    const { id: credentialId } = request.auth.credentials;
    const { noteId, userId } = request.payload;

    await this.notesService.verifyNoteOwner(noteId, credentialId);
    await this.collaborationsService.deleteCollaboration(noteId, userId);

    return {
      status: 'success',
      message: 'Kolaborasi berhasil dihapus',
    };
  }
}

module.exports = CollaborationsHandler;
