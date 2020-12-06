"""
Implements all figures available in chess.
"""


class Figure:
    def __init__(self):
        pass


class Pawn:
    def __init__(self, x, y):
        """
        Initializes a pawn with positions `x` and `y`.
        """

        self._x = x
        self._y = y

    def check_if_valid_move(self, x, y):
        """
        Checks whether a new position of the pawn is valid or not.
        """

        if y == self._y + 1:
            return True
        else:
            return False


    def move(self, x, y):
        """
        Updates position to new position.
        """

        self._x = x
        self._y = y
