const router = require("express").Router();

const Story = require("../models/Story");
const User = require("../models/User");
const { ensureAuthenticated } = require("../helpers/auth");

router.get("/", (req, res) => {
  Story.find({ status: "public" })
    .populate("user")
    .sort({ date: "desc" })
    .then(stories => {
      res.render("stories/index", { stories });
    });
});

router.get("/add", ensureAuthenticated, (req, res) => {
  res.render("stories/add");
});

router.post("/", ensureAuthenticated, (req, res) => {
  let allowComments = req.body.allowComments ? true : false;

  const story = new Story({
    title: req.body.title,
    body: req.body.body,
    status: req.body.status,
    allowComments: allowComments,
    user: req.user.id
  });

  story.save().then(story => {
    res.redirect(`/stories/show/${story.id}`);
  });
});

router.get("/show/:id", (req, res) => {
  Story.findOne({ _id: req.params.id })
    .populate("user")
    .populate("comments.commentUser")
    .then(story => {
      if (story.status === 'public') {
        res.render('stories/show', { story })
      } else {
        if (req.user && req.user.id === story.user._id) {
          res.render('stories/show', { story })
        } else {
          res.redirect('/stories');
        }
      }
    });
});

router.get("/edit/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    if (story.user !== req.user.id) {
      res.redirect('/stories')
    } else {
      res.render("stories/edit", { story });
    }
  });
});

router.put("/:id", ensureAuthenticated, (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    let allowComments = req.body.allowComments ? true : false;

    story.title = req.body.title;
    story.body = req.body.body;
    story.status = req.body.status;
    story.allowComments = allowComments;

    story.save().then(story => {
      res.redirect("/dashboard");
    });
  });
});

router.delete("/:id", ensureAuthenticated, (req, res) => {
  Story.remove({ _id: req.params.id }).then(() => {
    res.redirect("/dashboard");
  });
});

router.get("/user/:id", (req, res) => {
  Story.find({ user: req.params.id, status: "public" })
    .populate("user")
    .then(stories => {
      res.render("stories/user", { stories });
    });
});

router.get("/my", ensureAuthenticated, (req, res) => {
  Story.find({ user: req.user.id })
    .then(stories => {
      res.render("stories/user", { stories });
    });
});

router.post("/comment/:id", (req, res) => {
  Story.findOne({ _id: req.params.id }).then(story => {
    const newComment = {
      commentBody: req.body.commentBody,
      commentUser: req.user.id
    };

    story.comments.unshift(newComment);

    story.save().then(story => {
      res.redirect(`/stories/show/${story.id}`);
    });
  });
});

module.exports = router;
