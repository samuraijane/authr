## Instructions for Comments

##### The comments throughout the files in this application are similar to the endnotes used in term papers. There are three types of comments.

  * `//c031` where _c_ indicates a standard comment. Use this to remind yourself what the code is doing and to help others who come after you know what you were thinking. The vast majority of your comments will be of this type.
  * `//p017` where _p_ indicates something that is pending. This type of comment serves as a reminder that something is incomplete. When you deploy an application, there should not be any comments that begin with _p_.
  * `//v009` where _v_ indicates a comment that no longer applies to the current state of the code (i.e. it is invalid). As your application evolves, you will naturally delete some code as you find better solutions. When you do, you should not delete any comments associated with the deleted code but indicate the change by prefixing the number with a _v_. We do this because comments often contain useful information that we can apply to other projects and because we need the numbering applied to comments to remain consecutive and without gaps.

##### Each comment type is followed by a three-digit number which simply indicates the order in which the comments were created. Be aware that your very first comment, for example, will need two leading zeros (e.g. `//c001`).

##### This system for commenting allows developers to easily search for the details attached to code while having the freedom to be verbose, as well.
