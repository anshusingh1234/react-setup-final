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
  E0010010: {
    title: 'Something went wrong',
    message: 'Something went wrong!',
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
  },


  //Comments related errors
  E0030001: {
    title: 'Restricted Comment',
    message: 'Restricted Comment',
    info: {
      type: "fullScreen",
      data: {
        description: "Restricted Comment",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  E0030002: {
    title: 'Unauthorized Access',
    message: 'Not authorised to modify this comment',
    info: {
      type: "fullScreen",
      data: {
        description: "Not authorised to modify this comment",
        cta: "retry",
        label: "Retry"
      }
    }
  },
  E0030003: {
    title: 'Unauthorized Access',
    message: 'Not authorised to delete this comment',
    info: {
      type: "fullScreen",
      data: {
        description: "Not authorised to delete this comment",
        cta: "retry",
        label: "Retry"
      }
    }
  },

  //Users related errors
  E0040001: {
    title: 'User not found',
    message: 'User not found',
    info: {
      type: "fullScreen",
      data: {
        description: "User not found",
        cta: "retry",
        label: "Retry"
      }
    }
  }




};

module.exports = {
  errors: _errors
};
