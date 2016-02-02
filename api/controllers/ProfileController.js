module.exports = {
    index: function (req, res) {
        res.ok({
            name: req.user.name,
            email: req.user.email,
            access: req.user.access,
            signupDate: req.user.signupDate,
            team: req.user.team,
            zombieId: req.user.zombieId,
            activeHumanIds: req.user.activeHumanIds,
            inactiveHumanIds: req.user.inactiveHumanIds,
            humansTagged: req.user.humansTagged,
            badges: req.user.badges
        });
    }
}
