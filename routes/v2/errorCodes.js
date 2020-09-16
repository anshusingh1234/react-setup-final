const _errors = {
  // generic application wide codes | series E001****
  E0010001: {
    title: 'Update app',
    message: 'Please update your app for a better experience'
  },
  E0010002: {
    title: 'Internal Server Error',
    message: 'Oops..!! Something went wrong :(',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong.",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  E0010003: {
    title: 'Invalid request',
    message: 'Missing request body',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong.",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  E0010004: {
    title: 'Invalid request',
    message: 'Invalid / missing JSON body attribute(s)',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong.",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  E0010005: {title: 'Invalid app version info', message: 'Invalid app version information'},
  E0010006: {title: 'Unsupported image format', message: 'This image format is not supported'},
  E0010007: {title: 'File too large', message: 'File too large'},
  E0010008: {title: 'Unexpected file', message: 'Unexpected file'},
  E0010009: {
    title: 'Invalid request params',
    message: 'Invalid request params',
    info: {
      type: "fullScreen",
      data: {
        description: "Something went wrong.",
        cta: "retry",
        label: "Retry"
      }
    }
  },

  //Feed related errors
  E0020001: {
    title: 'Post not found',
    message: 'Post not found',
    info: {
      type: "fullScreen",
      data: {
        description: "Post not found or user is not author",
        cta: "retry",
        label: "Retry"
      }
    }
  }
};

module.exports = {
  errors: _errors
};
